import API from "./axiosApi";

/* ==========================
   COURSE PROGRESS
========================== */

export const getProgress = async () => {
  const { data } = await API.get("/progress");
  return data;
};

export const updateProgress = async (courseId, progress) => {
  const { data } = await API.put(`/progress/${courseId}`, {
    progress,
  });

  return data;
};
