const Course = require("../models/Course");
const Progress = require("../models/Progress");

/* ==========================================
   ENROLL USER IN COURSE
========================================== */

const enrollUserInCourse = async ({
  userId,
  courseId,
}) => {
  const course = await Course.findById(courseId);

  if (!course) {
    const error = new Error("Course not found.");
    error.statusCode = 404;
    throw error;
  }

  if (!course.published) {
    const error = new Error(
      "This course is not currently available for enrollment."
    );
    error.statusCode = 400;
    throw error;
  }

  const existingProgress = await Progress.findOne({
    user: userId,
    course: course._id,
  });

  if (existingProgress) {
    const error = new Error(
      "You are already enrolled in this course."
    );
    error.statusCode = 409;
    throw error;
  }

  /* ------------------------------------------
     FIND FIRST LESSON
  ------------------------------------------ */

  const sortedModules = [...(course.modules || [])].sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );

  let firstLesson = null;

  for (const module of sortedModules) {
    const sortedLessons = [...(module.lessons || [])].sort(
      (a, b) => (a.order || 0) - (b.order || 0)
    );

    if (sortedLessons.length > 0) {
      firstLesson = sortedLessons[0];
      break;
    }
  }

  /* ------------------------------------------
     CREATE PROGRESS
  ------------------------------------------ */

  const progress = await Progress.create({
    user: userId,
    course: course._id,
    percentage: 0,
    status: "not_started",
    currentLesson: firstLesson
      ? firstLesson._id
      : null,
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

  /* ------------------------------------------
     UPDATE ENROLLMENT COUNT
  ------------------------------------------ */

  course.enrollments += 1;

  await course.save();

  return {
    course,
    progress,
  };
};

module.exports = {
  enrollUserInCourse,
};
