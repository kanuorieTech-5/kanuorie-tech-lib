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
   GET PUBLIC COURSE CATALOG
   Curriculum is intentionally excluded.
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
      .select("-modules")
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
   GET ADMIN COURSE CATALOG
   Admins receive full curriculum.
========================================== */

const getAdminCourses = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 50;
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
    "Admin courses retrieved successfully.",
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
   Enrolled users only.
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

  const progress = await Progress.findOne({
    user: req.user._id,
    course: course._id,
  });

  // Course details/curriculum are protected.
  // A learner must be enrolled before accessing them.
  if (!progress) {
    throw new ApiError(
      403,
      "You must be enrolled in this course to access the course details and curriculum."
    );
  }

  return ApiResponse.success(
    res,
    {
      course,
      progress,
    },
    "Course retrieved successfully."
  );
});

/* ==========================================
   UPDATE COURSE
========================================== */

const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    throw new ApiError(404, "Course not found.");
  }

  /*
   * Build the update explicitly.
   *
   * This prevents unexpected request properties from
   * replacing course data.
   */

  const allowedFields = [
    "title",
    "description",
    "category",
    "image",
    "link",
    "instructor",
    "level",
    "language",
    "duration",
    "featured",
    "premium",
    "published",
    "tags",
    "prerequisites",
    "outcomes",
    "modules",
  ];

  const updateData = {};

  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(req.body, field)) {
      updateData[field] = req.body[field];
    }
  }

  /*
   * IMPORTANT:
   *
   * If modules are not included in the request,
   * preserve the existing curriculum.
   *
   * An explicitly supplied [] is still allowed because
   * the admin may intentionally remove all modules.
   */

  const updatedCourse = await Course.findByIdAndUpdate(
    req.params.id,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

  return ApiResponse.success(
    res,
    updatedCourse,
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
   COMPLETE LESSON
========================================== */

const completeLesson = asyncHandler(async (req, res) => {
  const { id: courseId, lessonId } = req.params;

  /* ------------------------------------------
     FIND COURSE
  ------------------------------------------ */

  const course = await Course.findById(courseId);

  if (!course) {
    throw new ApiError(404, "Course not found.");
  }

  /* ------------------------------------------
     FIND USER PROGRESS
  ------------------------------------------ */

  const progress = await Progress.findOne({
    user: req.user._id,
    course: course._id,
  });

  if (!progress) {
    throw new ApiError(
      404,
      "Progress record not found. Please enroll in this course first."
    );
  }

  /* ------------------------------------------
     FIND LESSON INSIDE COURSE
  ------------------------------------------ */

  let lessonExists = false;

  for (const module of course.modules || []) {
    const lesson = (module.lessons || []).find(
      (item) => item._id.toString() === lessonId
    );

    if (lesson) {
      lessonExists = true;
      break;
    }
  }

  if (!lessonExists) {
    throw new ApiError(
      404,
      "Lesson not found in this course."
    );
  }

  /* ------------------------------------------
     PREVENT DUPLICATE COMPLETION
  ------------------------------------------ */

  const alreadyCompleted = progress.completedLessons.some(
    (completedLessonId) =>
      completedLessonId.toString() === lessonId
  );

  if (!alreadyCompleted) {
    progress.completedLessons.push(lessonId);
  }

  /* ------------------------------------------
     CALCULATE TOTAL LESSONS
  ------------------------------------------ */

  const allLessons = [];

  for (const module of course.modules || []) {
    for (const lesson of module.lessons || []) {
      allLessons.push(lesson);
    }
  }

  const totalLessons = allLessons.length;

  const completedLessonCount =
    progress.completedLessons.length;

  /* ------------------------------------------
     CALCULATE PERCENTAGE ON SERVER
  ------------------------------------------ */

  const percentage =
    totalLessons > 0
      ? Math.round(
          (completedLessonCount / totalLessons) * 100
        )
      : 0;

  progress.percentage = percentage;

  /* ------------------------------------------
     UPDATE STATUS
  ------------------------------------------ */

  if (percentage >= 100) {
    progress.status = "completed";
    progress.completed = true;

    if (!progress.completedAt) {
      progress.completedAt = new Date();
    }
  } else if (percentage > 0) {
    progress.status = "in_progress";
    progress.completed = false;
    progress.completedAt = null;
  } else {
    progress.status = "not_started";
    progress.completed = false;
    progress.completedAt = null;
  }

  progress.lastAccessed = new Date();

  await progress.save();

  return ApiResponse.success(
    res,
    progress,
    "Lesson completed successfully."
  );
});

/* ==========================================
   UPDATE PROGRESS
   Progress is calculated from completed lessons.
   Clients cannot manually set the percentage.
========================================== */

const updateProgress = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    throw new ApiError(404, "Course not found.");
  }

  const progress = await Progress.findOne({
    user: req.user._id,
    course: course._id,
  });

  if (!progress) {
    throw new ApiError(
      404,
      "Progress record not found."
    );
  }

  const totalLessons = (course.modules || []).reduce(
    (total, module) =>
      total + (module.lessons || []).length,
    0
  );

  const completedLessonCount =
    progress.completedLessons.length;

  const percentage =
    totalLessons > 0
      ? Math.round(
          (completedLessonCount / totalLessons) * 100
        )
      : 0;

  progress.percentage = percentage;
  progress.lastAccessed = new Date();

  await progress.save();

  return ApiResponse.success(
    res,
    progress,
    "Progress recalculated successfully."
  );
});

/* ==========================================
   UPDATE NOTES
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

/* ==========================================
   ENROLL
========================================== */

const enrollCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    throw new ApiError(404, "Course not found.");
  }

  if (!course.published) {
    throw new ApiError(
      400,
      "This course is not currently available for enrollment."
    );
  }

  const existingProgress = await Progress.findOne({
    user: req.user._id,
    course: course._id,
  });

  if (existingProgress) {
    throw new ApiError(
      409,
      "You are already enrolled in this course."
    );
  }

  const progress = await Progress.create({
    user: req.user._id,
    course: course._id,
    percentage: 0,
    status: "not_started",
    currentLesson: 0,
    completedLessons: [],
    bookmarkedLessons: [],
    watchTime: 0,
    quizScore: 0,
    notes: [],
    certificateIssued: false,
    completed: false,
    completedAt: null,
    lastAccessed: new Date(),
    lastProgressUpdate: new Date(),
  });

  course.enrollments += 1;

  await course.save();

  return ApiResponse.success(
    res,
    {
      course,
      progress,
    },
    "Successfully enrolled in course.",
    201
  );
});

/* ==========================================
   EXPORTS
========================================== */

module.exports = {
  saveCourse,
  getCourses,
  getAdminCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  completeLesson,
  updateProgress,
  updateNotes,
};