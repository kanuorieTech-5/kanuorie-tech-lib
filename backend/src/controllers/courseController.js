const Course = require("../models/Course");
const Progress = require("../models/Progress");

const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

/* ==========================================
   CREATE COURSE
========================================== */

const saveCourse = asyncHandler(async (req, res) => {
  const course = await Course.create({
    ...req.body,
    createdBy: req.user._id,
  });

  return ApiResponse.success(
    res,
    course,
    "Course created successfully.",
    201
  );
});

/* ==========================================
   GET ALL COURSES
========================================== */

const getCourses = asyncHandler(async (req, res) => {
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

  if (req.query.level) {
    filter.level = req.query.level;
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
        instructor: {
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

  const [courses, total] = await Promise.all([
    Course.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Course.countDocuments(filter),
  ]);

  return ApiResponse.success(
    res,
    courses,
    "Courses retrieved successfully.",
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
   GET SINGLE COURSE
========================================== */

const getCourse = asyncHandler(async (req, res) => {
  const identifier = req.params.id;

  const filter = identifier.match(/^[0-9a-fA-F]{24}$/)
    ? { _id: identifier }
    : { slug: identifier };

  const course = await Course.findOne(filter).populate(
    "createdBy",
    "name email"
  );

  if (!course) {
    throw new ApiError(404, "Course not found.");
  }

  return ApiResponse.success(
    res,
    course,
    "Course retrieved successfully."
  );
});

/* ==========================================
   UPDATE COURSE
========================================== */

const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!course) {
    throw new ApiError(404, "Course not found.");
  }

  return ApiResponse.success(
    res,
    course,
    "Course updated successfully."
  );
});

/* ==========================================
   DELETE COURSE
========================================== */

const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    throw new ApiError(404, "Course not found.");
  }

  await Promise.all([
    Progress.deleteMany({
      course: course._id,
    }),
    course.deleteOne(),
  ]);

  return ApiResponse.success(
    res,
    null,
    "Course deleted successfully."
  );
});

/* ==========================================
   UPDATE COURSE PROGRESS
========================================== */

const updateProgress = asyncHandler(async (req, res) => {
  const { percentage } = req.body;

  const progress = await Progress.findOne({
    user: req.user._id,
    course: req.params.id,
  });

  if (!progress) {
    throw new ApiError(
      404,
      "Progress record not found."
    );
  }

  progress.percentage = percentage;
  progress.completed = percentage >= 100;

  if (percentage >= 100) {
    progress.completedAt = new Date();
  }

  await progress.save();

  return ApiResponse.success(
    res,
    progress,
    "Progress updated successfully."
  );
});

/* ==========================================
   UPDATE COURSE NOTES
========================================== */

const updateNotes = asyncHandler(async (req, res) => {
  const progress = await Progress.findOne({
    user: req.user._id,
    course: req.params.id,
  });

  if (!progress) {
    throw new ApiError(
      404,
      "Progress record not found."
    );
  }

  progress.notes = req.body.notes || [];

  await progress.save();

  return ApiResponse.success(
    res,
    progress,
    "Notes updated successfully."
  );
});

module.exports = {
  saveCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  updateProgress,
  updateNotes,
};