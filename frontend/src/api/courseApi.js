import API from "./axiosApi";

/* ==========================================
   COURSES
========================================== */

/**
 * Get all courses
 */
export const getCourses = async () => {
  const { data } = await API.get("/courses");
  return data;
};

/**
 * Get a single course
 */
export const getCourse = async (id) => {
  const { data } = await API.get(`/courses/${id}`);
  return data;
};

/**
 * Create / save a course
 * Admin only
 */
export const createCourse = async (courseData) => {
  const { data } = await API.post("/courses", courseData);

  return data;
};

export const saveCourse = createCourse;
/**
 * Update a course
 * Admin only
 */
export const updateCourse = async (id, courseData) => {
  const { data } = await API.put(`/courses/${id}`, courseData);

  return data;
};

/**
 * Delete a course
 * Admin only
 */
export const deleteCourse = async (id) => {
  const { data } = await API.delete(`/courses/${id}`);

  return data;
};

/**
 * Enroll in a course
 */
export const enrollCourse = async (id) => {
  const { data } = await API.post(`/courses/${id}/enroll`);

  return data;
};

/**
 * Update course progress
 */
export const updateCourseProgress = async (id, progress) => {
  const { data } = await API.put(`/courses/${id}/progress`, progress);

  return data;
};

/**
 * Complete a lesson
 */
export const completeLesson = async (courseId, lessonId) => {
  const { data } = await API.put(`/courses/${courseId}/lessons/${lessonId}`);

  return data;
};

/**
 * Update course notes
 */
export const updateCourseNotes = async (id, notes) => {
  const { data } = await API.put(`/courses/${id}/notes`, notes);

  return data;
};

export default {
  getCourses,
  getCourse,
  saveCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  updateCourseProgress,
  completeLesson,
  updateCourseNotes,
};
