const cloudinary = require("../config/cloudinary");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const teamService = require("../services/teamService");

/* ==========================================
   CREATE TEAM MEMBER
========================================== */

const createTeamMember = asyncHandler(async (req, res) => {
  const data = {
    ...req.body,
  };

  // Upload image if provided
  if (req.file) {
    const dataURI = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
      "base64"
    )}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "kanuorietech/team",
      resource_type: "image",
      transformation: [
        {
          width: 1200,
          crop: "limit",
        },
        {
          quality: "auto",
        },
        {
          fetch_format: "auto",
        },
      ],
    });

    data.image = result.secure_url;
  }

  // Convert multipart form values to correct types
  if (data.featured !== undefined) {
    data.featured = data.featured === "true";
  }

  if (data.active !== undefined) {
    data.active = data.active === "true";
  }

  if (data.order !== undefined) {
    data.order = Number(data.order);
  }

  const member = await teamService.create(data);

  return ApiResponse.success(
    res,
    member,
    "Team member created successfully.",
    201
  );
});

/* ==========================================
   GET ALL TEAM MEMBERS
========================================== */

const getTeamMembers = asyncHandler(async (req, res) => {
  const members = await teamService.getAll(req.query);

  return ApiResponse.success(
    res,
    members,
    "Team members retrieved successfully."
  );
});

/* ==========================================
   GET SINGLE TEAM MEMBER
========================================== */

const getTeamMember = asyncHandler(async (req, res) => {
  const member = await teamService.getById(req.params.id);

  if (!member) {
    throw new ApiError(404, "Team member not found.");
  }

  return ApiResponse.success(
    res,
    member,
    "Team member retrieved successfully."
  );
});

/* ==========================================
   UPDATE TEAM MEMBER
========================================== */

const updateTeamMember = asyncHandler(async (req, res) => {
  const data = {
    ...req.body,
  };

  // Upload replacement image if selected
  if (req.file) {
    const dataURI = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
      "base64"
    )}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "kanuorietech/team",
      resource_type: "image",
      transformation: [
        {
          width: 1200,
          crop: "limit",
        },
        {
          quality: "auto",
        },
        {
          fetch_format: "auto",
        },
      ],
    });

    data.image = result.secure_url;
  }

  if (data.featured !== undefined) {
    data.featured = data.featured === "true";
  }

  if (data.active !== undefined) {
    data.active = data.active === "true";
  }

  if (data.order !== undefined) {
    data.order = Number(data.order);
  }

  const member = await teamService.update(
    req.params.id,
    data
  );

  if (!member) {
    throw new ApiError(404, "Team member not found.");
  }

  return ApiResponse.success(
    res,
    member,
    "Team member updated successfully."
  );
});

/* ==========================================
   DELETE TEAM MEMBER
========================================== */

const deleteTeamMember = asyncHandler(async (req, res) => {
  const member = await teamService.delete(req.params.id);

  if (!member) {
    throw new ApiError(404, "Team member not found.");
  }

  return ApiResponse.success(
    res,
    null,
    "Team member deleted successfully."
  );
});

/* ==========================================
   GET FEATURED TEAM MEMBERS
========================================== */

const getFeaturedMembers = asyncHandler(async (req, res) => {
  const members = await teamService.featured();

  return ApiResponse.success(
    res,
    members,
    "Featured team members retrieved successfully."
  );
});

/* ==========================================
   GET ACTIVE TEAM MEMBERS
========================================== */

const getActiveMembers = asyncHandler(async (req, res) => {
  const members = await teamService.active();

  return ApiResponse.success(
    res,
    members,
    "Active team members retrieved successfully."
  );
});

/* ==========================================
   TEAM STATISTICS
========================================== */

const getTeamStats = asyncHandler(async (req, res) => {
  const stats = await teamService.stats();

  return ApiResponse.success(
    res,
    stats,
    "Team statistics retrieved successfully."
  );
});

/* ==========================================
   EXPORTS
========================================== */

module.exports = {
  createTeamMember,
  getTeamMembers,
  getTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getFeaturedMembers,
  getActiveMembers,
  getTeamStats,
};