const Service = require("../models/Service");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

/* ==========================================
   CREATE SERVICE
========================================== */

const createService = asyncHandler(async (req, res) => {
  const service = await Service.create(req.body);

  return ApiResponse.success(
    res,
    service,
    "Service created successfully.",
    201
  );
});

/* ==========================================
   GET ALL SERVICES
========================================== */

const getServices = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};

  if (req.query.active !== undefined) {
    filter.active = req.query.active === "true";
  }

  if (req.query.featured !== undefined) {
    filter.featured = req.query.featured === "true";
  }

  if (req.query.search) {
    filter.$or = [
      {
        title: {
          $regex: req.query.search,
          $options: "i",
        },
      },
      {
        shortDescription: {
          $regex: req.query.search,
          $options: "i",
        },
      },
      {
        description: {
          $regex: req.query.search,
          $options: "i",
        },
      },
      {
        technologies: {
          $in: [new RegExp(req.query.search, "i")],
        },
      },
      {
        benefits: {
          $in: [new RegExp(req.query.search, "i")],
        },
      },
    ];
  }

  const [services, total] = await Promise.all([
    Service.find(filter)
      .sort({
        order: 1,
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit),

    Service.countDocuments(filter),
  ]);

  return ApiResponse.success(
    res,
    {
      services,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    },
    "Services retrieved successfully."
  );
});

/* ==========================================
   GET SINGLE SERVICE
========================================== */

const getService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    throw new ApiError(404, "Service not found.");
  }

  return ApiResponse.success(
    res,
    service,
    "Service retrieved successfully."
  );
});

/* ==========================================
   UPDATE SERVICE
========================================== */

const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    throw new ApiError(404, "Service not found.");
  }

  Object.assign(service, req.body);

  await service.save();

  return ApiResponse.success(
    res,
    service,
    "Service updated successfully."
  );
});

/* ==========================================
   DELETE SERVICE
========================================== */

const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    throw new ApiError(404, "Service not found.");
  }

  await service.deleteOne();

  return ApiResponse.success(
    res,
    null,
    "Service deleted successfully."
  );
});

/* ==========================================
   GET FEATURED SERVICES
========================================== */

const getFeaturedServices = asyncHandler(async (req, res) => {
  const services = await Service.find({
    featured: true,
    active: true,
  }).sort({
    order: 1,
    createdAt: -1,
  });

  return ApiResponse.success(
    res,
    services,
    "Featured services retrieved successfully."
  );
});

/* ==========================================
   GET ACTIVE SERVICES
========================================== */

const getActiveServices = asyncHandler(async (req, res) => {
  const services = await Service.find({
    active: true,
  }).sort({
    order: 1,
    createdAt: -1,
  });

  return ApiResponse.success(
    res,
    services,
    "Active services retrieved successfully."
  );
});

/* ==========================================
   SERVICE STATISTICS
========================================== */

const getServiceStats = asyncHandler(async (req, res) => {
  const [
    totalServices,
    activeServices,
    featuredServices,
  ] = await Promise.all([
    Service.countDocuments(),
    Service.countDocuments({
      active: true,
    }),
    Service.countDocuments({
      featured: true,
    }),
  ]);

  return ApiResponse.success(
    res,
    {
      totalServices,
      activeServices,
      featuredServices,
    },
    "Service statistics retrieved successfully."
  );
});

module.exports = {
  createService,
  getServices,
  getService,
  updateService,
  deleteService,
  getFeaturedServices,
  getActiveServices,
  getServiceStats,
};