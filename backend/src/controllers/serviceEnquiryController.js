const Contact = require("../models/Contact");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

const serviceLabels = {
  web: "Web Development",
  mobile: "Mobile App",
  uiux: "UI/UX Design",
  consulting: "Consulting",
};

const createServiceEnquiry = asyncHandler(async (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const service = String(req.body.service || "").trim();
  const budget = String(req.body.budget || "").trim();
  const message = String(req.body.message || "").trim();

  if (!name || !email || !service || !message) {
    throw new ApiError(
      400,
      "Name, email, service, and project details are required."
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ApiError(400, "Please provide a valid email address.");
  }

  if (!serviceLabels[service]) {
    throw new ApiError(400, "Please select a valid service.");
  }

  const enquiry = await Contact.create({
    name,
    email,
    subject: serviceLabels[service],
    service: serviceLabels[service],
    budget,
    message,
    inquiryType: serviceLabels[service],
    isServiceInquiry: true,
    status: "new",
    isRead: false,
    replied: false,
    ipAddress: req.ip || "",
  });

  return ApiResponse.success(
    res,
    enquiry,
    "Your service enquiry has been submitted successfully.",
    201
  );
});

const getServiceEnquiries = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
  const skip = (page - 1) * limit;

  const filter = { isServiceInquiry: true };

  const allowedStatuses = [
    "new",
    "contacted",
    "in-progress",
    "completed",
    "cancelled",
  ];

  if (req.query.status && allowedStatuses.includes(req.query.status)) {
    filter.status = req.query.status;
  }

  if (req.query.search) {
    const search = String(req.query.search).trim().slice(0, 100);
    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "i");

    filter.$or = [
      { name: regex },
      { email: regex },
      { service: regex },
      { subject: regex },
      { message: regex },
      { budget: regex },
    ];
  }

  const [enquiries, total] = await Promise.all([
    Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Contact.countDocuments(filter),
  ]);

  return ApiResponse.success(
    res,
    enquiries,
    "Service enquiries retrieved successfully.",
    200,
    {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    }
  );
});

const getServiceEnquiryStats = asyncHandler(async (req, res) => {
  const base = { isServiceInquiry: true };

  const [total, newCount, contacted, inProgress, completed, cancelled] =
    await Promise.all([
      Contact.countDocuments(base),
      Contact.countDocuments({ ...base, status: "new" }),
      Contact.countDocuments({ ...base, status: "contacted" }),
      Contact.countDocuments({ ...base, status: "in-progress" }),
      Contact.countDocuments({ ...base, status: "completed" }),
      Contact.countDocuments({ ...base, status: "cancelled" }),
    ]);

  return ApiResponse.success(
    res,
    {
      total,
      new: newCount,
      contacted,
      inProgress,
      completed,
      cancelled,
    },
    "Service enquiry statistics retrieved successfully."
  );
});

const updateServiceEnquiryStatus = asyncHandler(async (req, res) => {
  const allowedStatuses = [
    "new",
    "contacted",
    "in-progress",
    "completed",
    "cancelled",
  ];

  const status = String(req.body.status || "");

  if (!allowedStatuses.includes(status)) {
    throw new ApiError(400, "Please provide a valid enquiry status.");
  }

  const enquiry = await Contact.findOneAndUpdate(
    {
      _id: req.params.id,
      isServiceInquiry: true,
    },
    {
      $set: {
        status,
        isRead: true,
        ...(status === "contacted"
          ? { replied: true, repliedAt: new Date() }
          : {}),
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!enquiry) {
    throw new ApiError(404, "Service enquiry not found.");
  }

  return ApiResponse.success(
    res,
    enquiry,
    "Service enquiry status updated successfully."
  );
});

module.exports = {
  createServiceEnquiry,
  getServiceEnquiries,
  getServiceEnquiryStats,
  updateServiceEnquiryStatus,
};
