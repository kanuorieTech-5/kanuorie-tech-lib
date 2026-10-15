const Contact = require("../models/Contact");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

const serviceLabels = {
  web: "Web Development",
  mobile: "Mobile App Development",
  uiux: "UI/UX Design",
  consulting: "Technology Consulting",
  ecommerce: "E-commerce Website",
  redesign: "Website Redesign",
  api: "API Integration",
  maintenance: "Website Maintenance & Support",
  other: "Other",
};

const allowedContactMethods = ["email", "whatsapp", "phone"];

const createServiceEnquiry = asyncHandler(async (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "")
    .trim()
    .toLowerCase();

  const service = String(req.body.service || "").trim();
  const phone = String(req.body.phone || "").trim();
  const company = String(req.body.company || "").trim();
  const projectType = String(req.body.projectType || "").trim();
  const budget = String(req.body.budget || "").trim();
  const timeline = String(req.body.timeline || "").trim();
  const preferredContact = String(
    req.body.preferredContact || "email"
  )
    .trim()
    .toLowerCase();

  const message = String(req.body.message || "").trim();
  const referenceUrl = String(req.body.referenceUrl || "").trim();
  const additionalRequirements = String(
    req.body.additionalRequirements || ""
  ).trim();

  // Conditional service-specific answers
  const platform = String(req.body.platform || "").trim();
  const designType = String(req.body.designType || "").trim();
  const apiDetails = String(req.body.apiDetails || "").trim();
  const maintenanceNeeds = String(
    req.body.maintenanceNeeds || ""
  ).trim();
  const websiteType = String(req.body.websiteType || "").trim();

  const projectRequirements = Array.isArray(req.body.projectRequirements)
    ? [
        ...new Set(
          req.body.projectRequirements
            .filter((item) => typeof item === "string")
            .map((item) => item.trim())
            .filter(Boolean)
        ),
      ]
    : [];

  // Validate required fields
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

  if (message.length < 10) {
    throw new ApiError(
      400,
      "Please provide at least 10 characters describing your project."
    );
  }

  if (message.length > 5000) {
    throw new ApiError(
      400,
      "Project details cannot exceed 5000 characters."
    );
  }

  if (additionalRequirements.length > 2000) {
    throw new ApiError(
      400,
      "Additional requirements cannot exceed 2000 characters."
    );
  }

  if (apiDetails.length > 2000 || maintenanceNeeds.length > 2000) {
    throw new ApiError(
      400,
      "Service-specific details cannot exceed 2000 characters."
    );
  }

  if (!allowedContactMethods.includes(preferredContact)) {
    throw new ApiError(
      400,
      "Please select a valid preferred contact method."
    );
  }

  // Save the enquiry and its conditional answers
  const enquiry = await Contact.create({
    name,
    email,
    phone,
    company,

    subject: serviceLabels[service],
    service: serviceLabels[service],
    projectType,
    budget,
    timeline,
    preferredContact,

    referenceUrl,
    message,
    additionalRequirements,
    projectRequirements,

    platform,
    designType,
    apiDetails,
    maintenanceNeeds,
    websiteType,

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

    // Escape special regex characters entered by the user
    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "i");

    filter.$or = [
      { name: regex },
      { email: regex },
      { phone: regex },
      { company: regex },
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