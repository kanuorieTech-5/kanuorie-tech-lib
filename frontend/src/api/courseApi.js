import API from "./axiosApi";

/* ==========================
   COURSES
========================== */

export const getCourses = async () => {
  const { data } = await API.get("/courses");
  return data;
};

export const getCourse = async (id) => {
  const { data } = await API.get(`/courses/${id}`);
  return data;
};

export const enrollCourse = async (id) => {
  const { data } = await API.post(`/courses/${id}/enroll`);
  return data;
};

export const updateCourseProgress = async (
  id,
  progress
) => {
  const { data } = await API.put(
    `/courses/${id}/progress`,
    progress
  );
  return data;
};

export const completeLesson = async (
  courseId,
  lessonId
) => {
  const { data } = await API.put(
    `/courses/${courseId}/lessons/${lessonId}`
  );
  return data;
};