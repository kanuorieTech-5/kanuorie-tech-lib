const CareerApplication = require("../models/CareerApplication");

const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

/* ==========================================
   CREATE CAREER APPLICATION
========================================== */

const createApplication = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    position,
    portfolio,
    coverLetter,
  } = req.body;

  if (!fullName?.trim()) {
    throw new ApiError(400, "Full name is required.");
  }

  if (!email?.trim()) {
    throw new ApiError(400, "Email address is required.");
  }

  if (!position?.trim()) {
    throw new ApiError(400, "Position is required.");
  }

  const normalizedEmail = email.trim().toLowerCase();

  const application = await CareerApplication.create({
    fullName: fullName.trim(),
    email: normalizedEmail,
    position: position.trim(),
    portfolio: portfolio?.trim() || "",
    coverLetter: coverLetter?.trim() || "",
    ipAddress:
      req.ip ||
      req.headers["x-forwarded-for"] ||
      "",
  });

  return ApiResponse.success(
    res,
    application,
    "Career application submitted successfully.",
    201
  );
});

/* ==========================================
   GET ALL APPLICATIONS
========================================== */

const getApplications = asyncHandler(async (req, res) => {
  const page = Math.max(
    Number(req.query.page) || 1,
    1
  );

  const limit = Math.min(
    Math.max(Number(req.query.limit) || 10, 1),
    100
  );

  const skip = (page - 1) * limit;

  const filter = {};

  if (req.query.status) {
    filter.status = req.query.status;
  }

  if (req.query.isRead !== undefined) {
    filter.isRead = req.query.isRead === "true";
  }

  if (req.query.position) {
    filter.position = {
      $regex: req.query.position,
      $options: "i",
    };
  }

  if (req.query.search) {
    filter.$or = [
      {
        fullName: {
          $regex: req.query.search,
          $options: "i",
        },
      },
      {
        email: {
          $regex: req.query.search,
          $options: "i",
        },
      },
      {
        position: {
          $regex: req.query.search,
          $options: "i",
        },
      },
    ];
  }

  const [applications, total] = await Promise.all([
    CareerApplication.find(filter)
      .populate(
        "reviewedBy",
        "firstName lastName email"
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    CareerApplication.countDocuments(filter),
  ]);

  return ApiResponse.success(
    res,
    applications,
    "Career applications retrieved successfully.",
    200,
    {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    }
  );
});

/* ==========================================
   GET SINGLE APPLICATION
========================================== */

const getApplication = asyncHandler(async (req, res) => {
  const application =
    await CareerApplication.findById(
      req.params.id
    ).populate(
      "reviewedBy",
      "firstName lastName email"
    );

  if (!application) {
    throw new ApiError(
      404,
      "Career application not found."
    );
  }

  return ApiResponse.success(
    res,
    application,
    "Career application retrieved successfully."
  );
});

/* ==========================================
   UPDATE APPLICATION STATUS
========================================== */

const updateApplicationStatus = asyncHandler(
  async (req, res) => {
    const allowedStatuses = [
      "New",
      "Reviewing",
      "Shortlisted",
      "Interview",
      "Accepted",
      "Rejected",
    ];

    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
      throw new ApiError(
        400,
        "Invalid application status."
      );
    }

    const application =
      await CareerApplication.findById(
        req.params.id
      );

    if (!application) {
      throw new ApiError(
        404,
        "Career application not found."
      );
    }

    application.status = status;
    application.reviewedBy = req.user._id;
    application.reviewedAt = new Date();

    await application.save();

    return ApiResponse.success(
      res,
      application,
      "Application status updated successfully."
    );
  }
);

/* ==========================================
   UPDATE ADMIN NOTES
========================================== */

const updateApplicationNotes = asyncHandler(
  async (req, res) => {
    const application =
      await CareerApplication.findById(
        req.params.id
      );

    if (!application) {
      throw new ApiError(
        404,
        "Career application not found."
      );
    }

    application.notes =
      req.body.notes?.trim() || "";

    application.reviewedBy = req.user._id;
    application.reviewedAt = new Date();

    await application.save();

    return ApiResponse.success(
      res,
      application,
      "Application notes updated successfully."
    );
  }
);

/* ==========================================
   MARK APPLICATION AS READ
========================================== */

const markAsRead = asyncHandler(async (req, res) => {
  const application =
    await CareerApplication.findByIdAndUpdate(
      req.params.id,
      {
        isRead: true,
      },
      {
        new: true,
      }
    );

  if (!application) {
    throw new ApiError(
      404,
      "Career application not found."
    );
  }

  return ApiResponse.success(
    res,
    application,
    "Application marked as read."
  );
});

/* ==========================================
   MARK APPLICATION AS UNREAD
========================================== */

const markAsUnread = asyncHandler(
  async (req, res) => {
    const application =
      await CareerApplication.findByIdAndUpdate(
        req.params.id,
        {
          isRead: false,
        },
        {
          new: true,
        }
      );

    if (!application) {
      throw new ApiError(
        404,
        "Career application not found."
      );
    }

    return ApiResponse.success(
      res,
      application,
      "Application marked as unread."
    );
  }
);

/* ==========================================
   DELETE APPLICATION
========================================== */

const deleteApplication = asyncHandler(
  async (req, res) => {
    const application =
      await CareerApplication.findById(
        req.params.id
      );

    if (!application) {
      throw new ApiError(
        404,
        "Career application not found."
      );
    }

    await application.deleteOne();

    return ApiResponse.success(
      res,
      null,
      "Career application deleted successfully."
    );
  }
);

/* ==========================================
   CAREER APPLICATION STATISTICS
========================================== */

const getApplicationStats = asyncHandler(
  async (req, res) => {
    const [
      total,
      newApplications,
      reviewing,
      shortlisted,
      interview,
      accepted,
      rejected,
      unread,
    ] = await Promise.all([
      CareerApplication.countDocuments(),

      CareerApplication.countDocuments({
        status: "New",
      }),

      CareerApplication.countDocuments({
        status: "Reviewing",
      }),

      CareerApplication.countDocuments({
        status: "Shortlisted",
      }),

      CareerApplication.countDocuments({
        status: "Interview",
      }),

      CareerApplication.countDocuments({
        status: "Accepted",
      }),

      CareerApplication.countDocuments({
        status: "Rejected",
      }),

      CareerApplication.countDocuments({
        isRead: false,
      }),
    ]);

    return ApiResponse.success(
      res,
      {
        total,
        unread,
        statuses: {
          new: newApplications,
          reviewing,
          shortlisted,
          interview,
          accepted,
          rejected,
        },
      },
      "Career application statistics retrieved successfully."
    );
  }
);

module.exports = {
  createApplication,
  getApplications,
  getApplication,
  updateApplicationStatus,
  updateApplicationNotes,
  markAsRead,
  markAsUnread,
  deleteApplication,
  getApplicationStats,
};
