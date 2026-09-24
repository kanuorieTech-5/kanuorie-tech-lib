import API from "./axiosApi";

export const getCommunityPosts = async (params = {}) => {
  const { data } = await API.get("/community", {
    params,
  });

  return data;
};

export const getCommunityPost = async (postId) => {
  const { data } = await API.get(
    `/community/${postId}`,
  );

  return data;
};

export const getCommunityCategories = async () => {
  const { data } = await API.get(
    "/community/categories",
  );

  return data;
};

export const createCommunityPost = async (post) => {
  const { data } = await API.post(
    "/community",
    post,
  );

  return data;
};

export const deleteCommunityPost = async (
  postId,
) => {
  const { data } = await API.delete(
    `/community/${postId}`,
  );

  return data;
};

export default {
  getCommunityPosts,
  getCommunityPost,
  getCommunityCategories,
  createCommunityPost,
  deleteCommunityPost,
};