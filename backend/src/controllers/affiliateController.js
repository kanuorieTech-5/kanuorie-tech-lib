const Affiliate = require("../models/Affiliate");
const AffiliateReferral = require("../models/AffiliateReferral");
const AffiliatePayout = require("../models/AffiliatePayout");

const {
  generateReferralCode,
  formatPayoutDetails,
} = require("../services/affiliateService");

/* ==========================================
   GET /affiliate
========================================== */

const getAffiliateDashboard = async (
  req,
  res,
  next
) => {
  try {
    let affiliate = await Affiliate.findOne({
      user: req.user._id,
    });

    if (!affiliate) {
      const referralCode =
        await generateReferralCode(
          req.user.firstName
        );

      affiliate = await Affiliate.create({
        user: req.user._id,
        referralCode,
      });
    }

    const affiliateId = affiliate._id;

    const [
      totalClicks,
      successfulReferrals,
      pendingEarnings,
      approvedEarnings,
      paidEarnings,
    ] = await Promise.all([
      AffiliateReferral.countDocuments({
        affiliate: affiliateId,
      }),

      AffiliateReferral.countDocuments({
        affiliate: affiliateId,
        status: "converted",
      }),

      AffiliateReferral.aggregate([
        {
          $match: {
            affiliate: affiliateId,
            commissionStatus: "pending",
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$commissionAmount",
            },
          },
        },
      ]),

      AffiliateReferral.aggregate([
        {
          $match: {
            affiliate: affiliateId,
            commissionStatus: "approved",
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$commissionAmount",
            },
          },
        },
      ]),

      AffiliateReferral.aggregate([
        {
          $match: {
            affiliate: affiliateId,
            commissionStatus: "paid",
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$commissionAmount",
            },
          },
        },
      ]),
    ]);

    const pending =
      pendingEarnings[0]?.total || 0;

    const approved =
      approvedEarnings[0]?.total || 0;

    const paid =
      paidEarnings[0]?.total || 0;

    const referralLink =
      `${process.env.CLIENT_URL || "http://localhost:5173"}/register?ref=${affiliate.referralCode}`;

    return res.status(200).json({
      success: true,
      message: "Affiliate dashboard retrieved successfully.",
      data: {
        affiliate: {
          _id: affiliate._id,
          status: affiliate.status,
          referralCode: affiliate.referralCode,
          referralLink,
          commissionRate: affiliate.commissionRate,
          joinedAt: affiliate.joinedAt,
          payoutMethod: affiliate.payoutMethod,
          payoutDetails: formatPayoutDetails(
            affiliate.payoutDetails
          ),
        },

        overview: {
          totalClicks,
          successfulReferrals,
          totalEarnings:
            pending + approved + paid,
          pendingEarnings: pending,
          approvedEarnings: approved,
          paidEarnings: paid,
          currency: "USD",
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ==========================================
   ACTIVATE AFFILIATE
========================================== */

const activateAffiliate = async (
  req,
  res,
  next
) => {
  try {
    let affiliate = await Affiliate.findOne({
      user: req.user._id,
    });

    if (!affiliate) {
      const referralCode =
        await generateReferralCode(
          req.user.firstName
        );

      affiliate = await Affiliate.create({
        user: req.user._id,
        referralCode,
        status: "active",
      });
    } else {
      affiliate.status = "active";
      await affiliate.save();
    }

    return res.status(200).json({
      success: true,
      message: "Affiliate account activated successfully.",
      data: {
        affiliate: {
          _id: affiliate._id,
          status: affiliate.status,
          referralCode: affiliate.referralCode,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ==========================================
   TRACK REFERRAL CLICK
========================================== */

const trackReferralClick = async (
  req,
  res,
  next
) => {
  try {
    const { referralCode } = req.body;

    if (!referralCode?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Referral code is required.",
      });
    }

    const affiliate = await Affiliate.findOne({
      referralCode: referralCode.trim().toUpperCase(),
      status: "active",
    });

    if (!affiliate) {
      return res.status(404).json({
        success: false,
        message: "Affiliate referral code not found.",
      });
    }

    await AffiliateReferral.create({
      affiliate: affiliate._id,
      referralCode: affiliate.referralCode,
      status: "clicked",
    });

    return res.status(201).json({
      success: true,
      message: "Referral click recorded successfully.",
      data: {
        referralCode: affiliate.referralCode,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ==========================================
   GET REFERRALS
========================================== */

const getAffiliateReferrals = async (
  req,
  res,
  next
) => {
  try {
    const affiliate = await Affiliate.findOne({
      user: req.user._id,
    }).select("_id");

    if (!affiliate) {
      return res.status(200).json({
        success: true,
        message: "No affiliate account found.",
        data: {
          items: [],
          count: 0,
        },
        meta: {
          total: 0,
          page: 1,
          limit: 20,
          totalPages: 0,
        },
      });
    }

    const page = Math.max(
      Number(req.query.page) || 1,
      1
    );

    const limit = Math.min(
      Math.max(Number(req.query.limit) || 20, 1),
      50
    );

    const filter = {
      affiliate: affiliate._id,
    };

    const total =
      await AffiliateReferral.countDocuments(filter);

    const referrals =
      await AffiliateReferral.find(filter)
        .populate(
          "referredUser",
          "firstName lastName avatar"
        )
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

    const totalPages = Math.ceil(
      total / limit
    );

    return res.status(200).json({
      success: true,
      message: "Affiliate referrals retrieved successfully.",
      data: {
        items: referrals,
        count: referrals.length,
      },
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ==========================================
   GET EARNINGS
========================================== */

const getAffiliateEarnings = async (
  req,
  res,
  next
) => {
  try {
    const affiliate = await Affiliate.findOne({
      user: req.user._id,
    }).select("_id");

    if (!affiliate) {
      return res.status(200).json({
        success: true,
        message: "No affiliate earnings found.",
        data: {
          items: [],
          summary: {
            pending: 0,
            approved: 0,
            paid: 0,
            total: 0,
            currency: "USD",
          },
        },
      });
    }

    const referrals =
      await AffiliateReferral.find({
        affiliate: affiliate._id,
        commissionAmount: { $gt: 0 },
      })
        .sort({ createdAt: -1 })
        .lean();

    const summary = referrals.reduce(
      (result, item) => {
        const amount =
          Number(item.commissionAmount) || 0;

        result.total += amount;

        if (item.commissionStatus === "pending") {
          result.pending += amount;
        }

        if (item.commissionStatus === "approved") {
          result.approved += amount;
        }

        if (item.commissionStatus === "paid") {
          result.paid += amount;
        }

        return result;
      },
      {
        pending: 0,
        approved: 0,
        paid: 0,
        total: 0,
        currency: "USD",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Affiliate earnings retrieved successfully.",
      data: {
        items: referrals,
        summary,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ==========================================
   GET PAYOUTS
========================================== */

const getAffiliatePayouts = async (
  req,
  res,
  next
) => {
  try {
    const affiliate = await Affiliate.findOne({
      user: req.user._id,
    }).select("_id");

    if (!affiliate) {
      return res.status(200).json({
        success: true,
        message: "No affiliate payouts found.",
        data: {
          items: [],
          count: 0,
        },
      });
    }

    const payouts =
      await AffiliatePayout.find({
        affiliate: affiliate._id,
      })
        .sort({ createdAt: -1 })
        .lean();

    const items = payouts.map((payout) => ({
      ...payout,
      payoutDetails: formatPayoutDetails(
        payout.payoutDetails
      ),
    }));

    return res.status(200).json({
      success: true,
      message: "Affiliate payouts retrieved successfully.",
      data: {
        items,
        count: items.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ==========================================
   UPDATE PAYOUT INFORMATION
========================================== */

const updatePayoutInformation = async (
  req,
  res,
  next
) => {
  try {
    const {
      payoutMethod,
      payoutDetails = {},
    } = req.body;

    const validMethods = [
      "bank_transfer",
      "paypal",
      "other",
    ];

    if (
      !payoutMethod ||
      !validMethods.includes(payoutMethod)
    ) {
      return res.status(400).json({
        success: false,
        message: "A valid payout method is required.",
      });
    }

    let affiliate = await Affiliate.findOne({
      user: req.user._id,
    });

    if (!affiliate) {
      const referralCode =
        await generateReferralCode(
          req.user.firstName
        );

      affiliate = await Affiliate.create({
        user: req.user._id,
        referralCode,
      });
    }

    affiliate.payoutMethod = payoutMethod;
    affiliate.payoutDetails = {
      accountName:
        payoutDetails.accountName?.trim() || "",
      accountNumber:
        payoutDetails.accountNumber?.trim() || "",
      bankName:
        payoutDetails.bankName?.trim() || "",
      bankCode:
        payoutDetails.bankCode?.trim() || "",
      paypalEmail:
        payoutDetails.paypalEmail?.trim().toLowerCase() || "",
    };

    await affiliate.save();

    return res.status(200).json({
      success: true,
      message: "Payout information updated successfully.",
      data: {
        payoutMethod: affiliate.payoutMethod,
        payoutDetails: formatPayoutDetails(
          affiliate.payoutDetails
        ),
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ==========================================
   REQUEST PAYOUT
========================================== */

const requestAffiliatePayout = async (
  req,
  res,
  next
) => {
  try {
    const affiliate = await Affiliate.findOne({
      user: req.user._id,
    });

    if (!affiliate) {
      return res.status(404).json({
        success: false,
        message: "Affiliate account not found.",
      });
    }

    if (affiliate.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "Your affiliate account is not active.",
      });
    }

    if (!affiliate.payoutMethod) {
      return res.status(400).json({
        success: false,
        message: "Please configure your payout information first.",
      });
    }

    const pendingResult =
      await AffiliateReferral.aggregate([
        {
          $match: {
            affiliate: affiliate._id,
            commissionStatus: "approved",
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$commissionAmount",
            },
          },
        },
      ]);

    const amount =
      pendingResult[0]?.total || 0;

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "There are no approved earnings available for payout.",
      });
    }

    const payout = await AffiliatePayout.create({
      affiliate: affiliate._id,
      amount,
      currency: "USD",
      payoutMethod: affiliate.payoutMethod,
      payoutDetails: affiliate.payoutDetails,
    });

    await AffiliateReferral.updateMany(
      {
        affiliate: affiliate._id,
        commissionStatus: "approved",
      },
      {
        $set: {
          commissionStatus: "paid",
          paidAt: new Date(),
        },
      }
    );

    return res.status(201).json({
      success: true,
      message: "Affiliate payout requested successfully.",
      data: {
        payout: {
          ...payout.toObject(),
          payoutDetails: formatPayoutDetails(
            payout.payoutDetails
          ),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAffiliateDashboard,
  activateAffiliate,
  trackReferralClick,
  getAffiliateReferrals,
  getAffiliateEarnings,
  getAffiliatePayouts,
  updatePayoutInformation,
  requestAffiliatePayout,
};
