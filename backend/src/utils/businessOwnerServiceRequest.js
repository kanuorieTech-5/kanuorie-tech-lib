const Contact = require("../models/Contact");

const needOptions = {
  business_website: { label: "Business Website", service: "Web Development" },
  ecommerce: { label: "E-commerce Store", service: "E-commerce Website" },
  web_app: { label: "Web Application", service: "Web Development" },
  mobile_app: { label: "Mobile Application", service: "Mobile App Development" },
  automation: { label: "Business Automation", service: "Technology Consulting" },
  custom_software: { label: "Custom Software", service: "Web Development" },
  maintenance: { label: "Website Maintenance", service: "Website Maintenance & Support" },
  branding: { label: "Branding & Digital Design", service: "UI/UX Design" },
  marketing: { label: "Digital Marketing", service: "Technology Consulting" },
  consultation: { label: "Technical Consultation", service: "Technology Consulting" },
};

const businessTypeLabels = {
  startup: "Startup",
  small_business: "Small business",
  medium_business: "Medium-sized business",
  enterprise: "Large enterprise",
  ecommerce: "E-commerce business",
  education: "Education or training business",
  personal_brand: "Personal brand",
  nonprofit: "Nonprofit organization",
  other: "Other business",
};

const timelineLabels = {
  immediately: "As soon as possible",
  within_month: "Within one month",
  within_three_months: "Within three months",
  within_six_months: "Within six months",
  researching: "Just researching for now",
};

async function createBusinessOwnerServiceRequest(user) {
  const businessNeeds = Array.isArray(user.businessNeeds)
    ? [...new Set(user.businessNeeds.filter((need) => typeof need === "string"))]
    : [];

  if (!user.businessType || businessNeeds.length === 0) {
    throw new Error("Business type and at least one business need are required.");
  }

  const requestedServices = businessNeeds.map(
    (need) => needOptions[need] || { label: need, service: "Other" },
  );
  const primaryService = requestedServices[0].service;
  const businessType =
    businessTypeLabels[user.businessType] || user.businessType;
  const timeline =
    timelineLabels[user.projectTimeline] || user.projectTimeline || "Not provided";
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  const message = [
    "A business owner submitted a service request during account registration or profile setup.",
    `Business type: ${businessType}.`,
    `Services requested: ${requestedServices.map(({ label }) => label).join(", ")}.`,
    `Preferred timeline: ${timeline}.`,
  ].join("\n");

  const requestData = {
    name: fullName,
    email: user.email,
    phone: user.phone || "",
    company: businessType,
    subject: "Business owner service request",
    message,
    inquiryType: primaryService,
    isServiceInquiry: true,
    service: primaryService,
    projectType: "Business owner registration request",
    timeline,
    preferredContact: "email",
    projectRequirements: requestedServices.map(({ label }) => label),
    status: "new",
    isRead: false,
    replied: false,
    requesterUser: user._id,
  };

  const existingRequest = await Contact.findOne({
    requesterUser: user._id,
    isServiceInquiry: true,
  }).sort({ createdAt: -1 });

  if (existingRequest) {
    // Keep an unreviewed request aligned with the user's latest profile details.
    if (existingRequest.status === "new") {
      Object.assign(existingRequest, requestData);
      await existingRequest.save();
    }

    return existingRequest;
  }

  return Contact.create(requestData);
}

module.exports = createBusinessOwnerServiceRequest;
