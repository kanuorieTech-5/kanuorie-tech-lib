const opportunityService = require("../services/opportunityService");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

const createOpportunity = asyncHandler(async (req, res) => {
  const opportunity = await opportunityService.create(req.body, req.user);

  return ApiResponse.success(
    res,
    opportunity,
    "Opportunity created successfully.",
    201
  );
});

const getOpportunities = asyncHandler(async (req, res) => {
  const result = await opportunityService.getAll(req.query, {
    publicOnly: false,
  });

  return ApiResponse.success(
    res,
    result,
    "Opportunities retrieved successfully."
  );
});

const getPublicOpportunities = asyncHandler(async (req, res) => {
  const result = await opportunityService.getAll(req.query, {
    publicOnly: true,
  });

  return ApiResponse.success(
    res,
    result,
    "Opportunities retrieved successfully."
  );
});

const getOpportunity = asyncHandler(async (req, res) => {
  const opportunity = await opportunityService.getById(req.params.id);

  if (!opportunity) {
    throw new ApiError(404, "Opportunity not found.");
  }

  return ApiResponse.success(
    res,
    opportunity,
    "Opportunity retrieved successfully."
  );
});

const getPublicOpportunity = asyncHandler(async (req, res) => {
  const opportunity = await opportunityService.getById(req.params.id, {
    publicOnly: true,
  });

  if (!opportunity) {
    throw new ApiError(404, "Opportunity not found.");
  }

  return ApiResponse.success(
    res,
    opportunity,
    "Opportunity retrieved successfully."
  );
});

const updateOpportunity = asyncHandler(async (req, res) => {
  const opportunity = await opportunityService.update(
    req.params.id,
    req.body
  );

  if (!opportunity) {
    throw new ApiError(404, "Opportunity not found.");
  }

  return ApiResponse.success(
    res,
    opportunity,
    "Opportunity updated successfully."
  );
});

const deleteOpportunity = asyncHandler(async (req, res) => {
  const deleted = await opportunityService.delete(req.params.id);

  if (!deleted) {
    throw new ApiError(404, "Opportunity not found.");
  }

  return ApiResponse.success(
    res,
    null,
    "Opportunity deleted successfully."
  );
});

module.exports = {
  createOpportunity,
  getOpportunities,
  getPublicOpportunities,
  getOpportunity,
  getPublicOpportunity,
  updateOpportunity,
  deleteOpportunity,
};