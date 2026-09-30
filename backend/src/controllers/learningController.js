const Learning = require("../models/Learning");

const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

/* ==========================================
   CREATE LEARNING RESOURCE
========================================== */

const createLearningResource = asyncHandler(async (req, res) => {
  const resource = await Learning.create({
    ...req.body,
    createdBy: req.user._id,
  });

  return ApiResponse.success(
    res,
    resource,
    "Learning resource created successfully.",
    201
  );
});

/* ==========================================
   GET ALL LEARNING RESOURCES
========================================== */

const getLearningResources = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  const filter = {};

  if (req.query.category) {
    filter.category = req.query.category;
  }

  if (req.query.featured) {
    filter.featured = req.query.featured === "true";
  }

  if (req.query.premium) {
    filter.premium = req.query.premium === "true";
  }

  if (req.query.difficulty) {
    filter.difficulty = req.query.difficulty;
  }

  if (req.query.published) {
    filter.published = req.query.published === "true";
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
        author: {
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
        tags: {
          $regex: req.query.search,
          $options: "i",
        },
      },
    ];
  }

  const sort = {};

  switch (req.query.sort) {
    case "oldest":
      sort.createdAt = 1;
      break;

    case "downloads":
      sort.downloads = -1;
      break;

    case "rating":
      sort.rating = -1;
      break;

    case "views":
      sort.views = -1;
      break;

    default:
      sort.createdAt = -1;
  }

  const [resources, total] = await Promise.all([
    Learning.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit),

    Learning.countDocuments(filter),
  ]);

  return ApiResponse.success(
    res,
    resources,
    "Learning resources retrieved successfully.",
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
   GET SINGLE LEARNING RESOURCE
========================================== */

const getLearningResource = asyncHandler(async (req, res) => {
  const identifier = req.params.id;

  const filter = identifier.match(/^[0-9a-fA-F]{24}$/)
    ? { _id: identifier }
    : { slug: identifier };

  const resource = await Learning.findOneAndUpdate(
    filter,
    {
      $inc: {
        views: 1,
      },
    },
    {
      new: true,
    }
  );

  if (!resource) {
    throw new ApiError(
      404,
      "Learning resource not found."
    );
  }

  return ApiResponse.success(
    res,
    resource,
    "Learning resource retrieved successfully."
  );
});

/* ==========================================
   UPDATE LEARNING RESOURCE
========================================== */

const updateLearningResource = asyncHandler(async (req, res) => {
  const resource = await Learning.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!resource) {
    throw new ApiError(
      404,
      "Learning resource not found."
    );
  }

  return ApiResponse.success(
    res,
    resource,
    "Learning resource updated successfully."
  );
});

/* ==========================================
   DELETE LEARNING RESOURCE
========================================== */

const deleteLearningResource = asyncHandler(async (req, res) => {
  const resource = await Learning.findById(
    req.params.id
  );

  if (!resource) {
    throw new ApiError(
      404,
      "Learning resource not found."
    );
  }

  await resource.deleteOne();

  return ApiResponse.success(
    res,
    null,
    "Learning resource deleted successfully."
  );
});

/* ==========================================
   FEATURED LEARNING RESOURCES
========================================== */

const getFeaturedLearning = asyncHandler(async (req, res) => {
  const resources = await Learning.find({
    featured: true,
  })
    .sort({
      createdAt: -1,
    })
    .limit(8);

  return ApiResponse.success(
    res,
    resources,
    "Featured learning resources retrieved successfully."
  );
});

/* ==========================================
   LEARNING CATEGORIES
========================================== */

const getLearningCategories = asyncHandler(async (req, res) => {
  const categories = await Learning.distinct(
    "category"
  );

  return ApiResponse.success(
    res,
    categories,
    "Learning categories retrieved successfully."
  );
});

/* ==========================================
   DOWNLOAD LEARNING RESOURCE
========================================== */

const downloadLearningResource = asyncHandler(
  async (req, res) => {
    const resource = await Learning.findByIdAndUpdate(
      req.params.id,
      {
        $inc: {
          downloads: 1,
        },
      },
      {
        new: true,
      }
    );

    if (!resource) {
      throw new ApiError(
        404,
        "Learning resource not found."
      );
    }

    return ApiResponse.success(
      res,
      {
        downloadUrl:
          resource.pdf || resource.link,
      },
      "Download started."
    );
  }
);

/* ==========================================
   EXPORTS
========================================== */

module.exports = {
  createLearningResource,
  getLearningResources,
  getLearningResource,
  updateLearningResource,
  deleteLearningResource,
  getFeaturedLearning,
  getLearningCategories,
  downloadLearningResource,
};