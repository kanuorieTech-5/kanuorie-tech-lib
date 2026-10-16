const mongoose = require("mongoose");

const Affiliate = require("../models/Affiliate");
const AffiliatePayout = require("../models/AffiliatePayout");
const AffiliateReferral = require("../models/AffiliateReferral");
const CommunityReport = require("../models/CommunityReport");
const CommunityPost = require("../models/CommunityPost");

/* ==========================================
   AFFILIATES
========================================== */

const getOperationsAffiliates = async (req, res, next) => {
  try {
    const affiliates = await Affiliate.find()
      .populate("user", "firstName lastName email avatar")
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    return res.status(200).json({
      success: true,
      message: "Affiliates retrieved successfully.",
      data: {
        items: affiliates,
        count: affiliates.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateOperationsAffiliateStatus = async (
  req,
  res,
  next
) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "active",
      "suspended",
      "inactive",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid affiliate status.",
      });
    }

    const affiliate = await Affiliate.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true, runValidators: true }
    ).populate("user", "firstName lastName email");

    if (!affiliate) {
      return res.status(404).json({
        success: false,
        message: "Affiliate not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Affiliate status updated successfully.",
      data: { affiliate },
    });
  } catch (error) {
    next(error);
  }
};

/* ==========================================
   AFFILIATE PAYOUTS
========================================== */

const getOperationsPayouts = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};

    if (status) {
      const allowedStatuses = [
        "requested",
        "processing",
        "paid",
        "rejected",
        "cancelled",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid payout status filter.",
        });
      }

      filter.status = status;
    }

    const payouts = await AffiliatePayout.find(filter)
      .populate({
        path: "affiliate",
        populate: {
          path: "user",
          select: "firstName lastName email",
        },
      })
      .populate({
        path: "referrals",
        select:
          "referralCode referredUser commissionAmount commissionCurrency commissionStatus status",
      })
      .sort({ requestedAt: -1 })
      .limit(200)
      .lean();

    return res.status(200).json({
      success: true,
      message: "Affiliate payout requests retrieved successfully.",
      data: {
        items: payouts,
        count: payouts.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateOperationsPayoutStatus = async (
  req,
  res,
  next
) => {
  const { status, reference, rejectionReason } = req.body;
  const allowedStatuses = ["processing", "paid", "rejected"];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid payout status." });
  }
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid payout ID." });
  }
  if (status === "paid" && !String(reference || "").trim()) {
    return res.status(400).json({
      success: false,
      message: "Enter the payment reference before marking a payout as paid.",
    });
  }
  if (status === "rejected" && !String(rejectionReason || "").trim()) {
    return res.status(400).json({
      success: false,
      message: "Provide a reason for rejecting this payout.",
    });
  }

  let session;
  try {
    session = await mongoose.startSession();
    let updatedPayout;

    await session.withTransaction(async () => {
      const payout = await AffiliatePayout.findById(req.params.id).session(session);
      if (!payout) {
        const error = new Error("Payout request not found.");
        error.statusCode = 404;
        throw error;
      }
      if (!["requested", "processing"].includes(payout.status)) {
        const error = new Error(`This payout has already been ${payout.status} and cannot be processed again.`);
        error.statusCode = 409;
        throw error;
      }

      const now = new Date();
      const referralIds = payout.referrals || [];

      if (status === "paid") {
        if (!referralIds.length) {
          const error = new Error("This payout has no linked commission records. Reconcile it before marking it paid.");
          error.statusCode = 409;
          throw error;
        }

        // Accept unreserved legacy records, but never pay a commission reserved by a different payout.
        const eligibleFilter = {
          _id: { $in: referralIds },
          affiliate: payout.affiliate,
          commissionStatus: "approved",
          $or: [
            { payoutReservation: payout._id },
            { payoutReservation: null },
            { payoutReservation: { $exists: false } },
          ],
        };
        const eligibleReferrals = await AffiliateReferral.find(eligibleFilter)
          .select("_id")
          .session(session);

        if (eligibleReferrals.length !== referralIds.length) {
          const error = new Error("The linked commissions have changed or are reserved by another payout. Review this payout before proceeding.");
          error.statusCode = 409;
          throw error;
        }

        const referralUpdate = await AffiliateReferral.updateMany(
          eligibleFilter,
          { $set: { commissionStatus: "paid", paidAt: now, payoutReservation: payout._id } },
          { session }
        );
        if (referralUpdate.modifiedCount !== referralIds.length) {
          const error = new Error("Not all linked commissions could be marked paid. The payout update was cancelled.");
          error.statusCode = 409;
          throw error;
        }
      }

      if (status === "rejected" && referralIds.length) {
        // Only release records owned by this payout; never clear another payout's reservation.
        await AffiliateReferral.updateMany(
          {
            _id: { $in: referralIds },
            affiliate: payout.affiliate,
            commissionStatus: "approved",
            payoutReservation: payout._id,
          },
          { $set: { payoutReservation: null } },
          { session }
        );
      }

      payout.status = status;
      payout.processedAt = now;
      if (status === "paid") {
        payout.paidAt = now;
        payout.reference = String(reference).trim();
        payout.rejectionReason = "";
      } else if (status === "rejected") {
        payout.rejectionReason = String(rejectionReason).trim();
        payout.paidAt = null;
      }
      await payout.save({ session });
      updatedPayout = payout._id;
    });

    const result = await AffiliatePayout.findById(updatedPayout)
      .populate({
        path: "affiliate",
        populate: { path: "user", select: "firstName lastName email" },
      })
      .populate("referrals")
      .lean();

    return res.status(200).json({
      success: true,
      message: status === "paid"
        ? "Payout marked paid and linked commissions updated."
        : status === "rejected"
          ? "Payout request rejected and its commission reservations released."
          : "Payout moved to processing.",
      data: { payout: result },
    });
  } catch (error) {
    next(error);
  } finally {
    if (session) await session.endSession();
  }
};

/* ==========================================
   COMMUNITY REPORTS
========================================== */

const getOperationsCommunityReports = async (
  req,
  res,
  next
) => {
  try {
    const { status } = req.query;
    const filter = {};

    if (status) {
      const allowedStatuses = [
        "pending",
        "reviewed",
        "dismissed",
        "actioned",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid community report status.",
        });
      }

      filter.status = status;
    }

    const reports = await CommunityReport.find(filter)
      .populate("reporter", "firstName lastName email")
      .populate({
        path: "post",
        select: "title content category status author createdAt",
        populate: {
          path: "author",
          select: "firstName lastName email",
        },
      })
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    return res.status(200).json({
      success: true,
      message: "Community reports retrieved successfully.",
      data: {
        items: reports,
        count: reports.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateOperationsCommunityReport = async (
  req,
  res,
  next
) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "reviewed",
      "dismissed",
      "actioned",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid community report status.",
      });
    }

    const report = await CommunityReport.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true, runValidators: true }
    )
      .populate("reporter", "firstName lastName email")
      .populate("post", "title content category status");

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Community report not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Community report status updated successfully.",
      data: { report },
    });
  } catch (error) {
    next(error);
  }
};

const updateOperationsCommunityPost = async (
  req,
  res,
  next
) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["published", "hidden", "deleted"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid community post status.",
      });
    }

    const post = await CommunityPost.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true, runValidators: true }
    )
      .populate("author", "firstName lastName email");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Community post not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Community post moderation status updated successfully.",
      data: { post },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOperationsAffiliates,
  updateOperationsAffiliateStatus,
  getOperationsPayouts,
  updateOperationsPayoutStatus,
  getOperationsCommunityReports,
  updateOperationsCommunityReport,
  updateOperationsCommunityPost,
};