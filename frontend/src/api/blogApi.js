import API from "./axiosApi";

export const getBlogs = async () => {
  const { data } = await API.get("/blogs");
  return data;
};

export const getBlog = async (id) => {
  const { data } = await API.get(`/blogs/${id}`);
  return data;
};

export const createBlog = async (payload) => {
  const { data } = await API.post("/blogs", payload);
  return data;
};

export const updateBlog = async (id, payload) => {
  const { data } = await API.put(`/blogs/${id}`, payload);
  return data;
};

export const deleteBlog = async (id) => {
  const { data } = await API.delete(`/blogs/${id}`);
  return data;
};