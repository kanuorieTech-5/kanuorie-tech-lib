import API from "./axiosApi";

/* ==========================
   LEARNING LIBRARY
========================== */

export const getLearningResources = async (config = {}) => {
  const { data } = await API.get("/learning", config);

  return data;
};

export const getLearningResource = async (id) => {
  const { data } = await API.get(`/learning/${id}`);

  return data;
};

export const createLearningResource = async (resource) => {
  const { data } = await API.post("/learning", resource);

  return data;
};

export const updateLearningResource = async (id, resource) => {
  const { data } = await API.put(`/learning/${id}`, resource);

  return data;
};

export const deleteLearningResource = async (id) => {
  const { data } = await API.delete(`/learning/${id}`);

  return data;
};

export const getLearningCategories = async () => {
  const { data } = await API.get("/learning/categories");

  return data;
};

export const getFeaturedLearning = async () => {
  const { data } = await API.get("/learning/featured");

  return data;
};