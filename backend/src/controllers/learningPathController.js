const LearningPath = require("../models/LearningPath");
const Course = require("../models/Course");
const Progress = require("../models/Progress");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

const findPath = (id) => LearningPath.findOne(/^[0-9a-fA-F]{24}$/.test(id) ? { _id: id } : { slug: id });
const getPaths = asyncHandler(async (req, res) => {
  const paths = await LearningPath.find({ published: true }).sort({ displayOrder: 1, title: 1 }).lean();
  const ids = paths.map((path) => path._id);
  const counts = await Course.aggregate([{ $match: { learningPath: { $in: ids }, published: true } }, { $group: { _id: "$learningPath", count: { $sum: 1 }, duration: { $sum: "$duration" } } }]);
  const countMap = new Map(counts.map((item) => [String(item._id), item]));
  return ApiResponse.success(res, paths.map((path) => ({ ...path, totalStages: path.stages.length, ...(countMap.get(String(path._id)) || { count: 0, duration: 0 }), publishedCourseCount: countMap.get(String(path._id))?.count || 0 })), "Learning pathways retrieved successfully.");
});

const getPath = asyncHandler(async (req, res) => {
  const path = await findPath(req.params.id);
  if (!path || (!path.published && req.user?.role !== "admin")) throw new ApiError(404, "Learning pathway not found.");
  const courses = await Course.find({ learningPath: path._id, ...(req.user?.role === "admin" ? {} : { published: true }) }).select("-modules").populate("createdBy", "name").sort({ learningStage: 1, courseOrder: 1, title: 1 }).lean();
  const learnerId = req.user?._id || req.user?.id;
  const progress = learnerId ? await Progress.find({ user: learnerId, course: { $in: courses.map((course) => course._id) } }).lean() : [];
  const progressMap = new Map(progress.map((item) => [String(item.course), item]));
  const stages = path.stages.slice().sort((a, b) => a.number - b.number).map((stage) => ({ ...stage.toObject(), courses: courses.filter((course) => course.learningStage === stage.number).map((course) => ({ ...course, progress: progressMap.get(String(course._id)) || null })) }));
  const courseCount = courses.length;
  const completed = courses.filter((course) => progressMap.get(String(course._id))?.status === "completed").length;
  const totalDurationHours = courses.reduce((total, course) => total + (Number(course.duration) || 0), 0);
  return ApiResponse.success(res, { ...path.toObject(), stages, totalStages: stages.length, totalCourses: courseCount, totalDurationHours, progress: courseCount ? Math.round((completed / courseCount) * 100) : 0 }, "Learning pathway retrieved successfully.");
});

const listAdmin = asyncHandler(async (_req, res) => ApiResponse.success(res, await LearningPath.find().sort({ displayOrder: 1, title: 1 }), "Learning pathways retrieved successfully."));
const createPath = asyncHandler(async (req, res) => ApiResponse.success(res, await LearningPath.create(req.body), "Learning pathway created successfully.", 201));
const updatePath = asyncHandler(async (req, res) => {
  const allowed = ["title", "slug", "description", "category", "difficulty", "featuredImage", "published", "displayOrder", "learningObjectives", "skillsAcquired", "stages"];
  const update = Object.fromEntries(allowed.filter((key) => Object.hasOwn(req.body, key)).map((key) => [key, req.body[key]]));
  const path = await LearningPath.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
  if (!path) throw new ApiError(404, "Learning pathway not found.");
  return ApiResponse.success(res, path, "Learning pathway updated successfully.");
});
const removePath = asyncHandler(async (req, res) => {
  const path = await LearningPath.findById(req.params.id);
  if (!path) throw new ApiError(404, "Learning pathway not found.");
  // Detach courses without deleting courses or their learning records.
  await Course.updateMany({ learningPath: path._id }, { $set: { learningPath: null, learningStage: null, courseOrder: null } });
  await path.deleteOne();
  return ApiResponse.success(res, null, "Learning pathway deleted; course records were preserved.");
});
const assignCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { learningPath, learningStage, courseOrder } = req.body;
  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "Course not found.");
  if (learningPath) {
    const path = await LearningPath.findById(learningPath);
    if (!path) throw new ApiError(404, "Learning pathway not found.");
    if (!path.stages.some((stage) => stage.number === Number(learningStage))) throw new ApiError(400, "Select a stage that exists in this pathway.");
  }
  course.learningPath = learningPath || null;
  course.learningStage = learningPath ? Number(learningStage) : null;
  course.courseOrder = learningPath ? Math.max(1, Number(courseOrder) || 1) : null;
  await course.save();
  return ApiResponse.success(res, course, "Course pathway assignment updated.");
});

module.exports = { getPaths, getPath, listAdmin, createPath, updatePath, removePath, assignCourse };
