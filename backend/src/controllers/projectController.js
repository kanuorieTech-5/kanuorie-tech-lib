const Project = require("../models/Project");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

/* ==========================================
   CREATE PROJECT
========================================== */

const createProject = asyncHandler(async (req, res) => {
  const project = await Project.create({
    ...req.body,
    createdBy: req.user?._id,
  });

  return ApiResponse.success(
    res,
    project,
    "Project created successfully.",
    201
  );
});

/* ==========================================
   GET ALL PROJECTS
========================================== */

const getProjects = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};

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
        description: {
          $regex: req.query.search,
          $options: "i",
        },
      },
      {
        technologies: {
          $in: [
            new RegExp(req.query.search, "i"),
          ],
        },
      },
    ];
  }

  const [projects, total] = await Promise.all([
    Project.find(filter)
      .populate("createdBy", "firstName lastName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Project.countDocuments(filter),
  ]);

  return ApiResponse.success(
    res,
    {
      projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    },
    "Projects retrieved successfully."
  );
});

/* ==========================================
   GET SINGLE PROJECT
========================================== */

const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate(
      "createdBy",
      "firstName lastName email"
    );

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  return ApiResponse.success(
    res,
    project,
    "Project retrieved successfully."
  );
});

/* ==========================================
   UPDATE PROJECT
========================================== */

const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  Object.assign(project, req.body);

  await project.save();

  return ApiResponse.success(
    res,
    project,
    "Project updated successfully."
  );
});

/* ==========================================
   DELETE PROJECT
========================================== */

const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  await project.deleteOne();

  return ApiResponse.success(
    res,
    null,
    "Project deleted successfully."
  );
});

/* ==========================================
   FEATURED PROJECTS
========================================== */

const getFeaturedProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({
    featured: true,
  })
    .populate(
      "createdBy",
      "firstName lastName"
    )
    .sort({ createdAt: -1 });

  return ApiResponse.success(
    res,
    projects,
    "Featured projects retrieved successfully."
  );
});

/* ==========================================
   PROJECT STATISTICS
========================================== */

const getProjectStats = asyncHandler(async (req, res) => {
  const [
    totalProjects,
    featuredProjects,
  ] = await Promise.all([
    Project.countDocuments(),
    Project.countDocuments({
      featured: true,
    }),
  ]);

  return ApiResponse.success(
    res,
    {
      totalProjects,
      featuredProjects,
    },
    "Project statistics retrieved successfully."
  );
});

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  getFeaturedProjects,
  getProjectStats,
};