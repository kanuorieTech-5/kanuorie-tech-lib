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

export const getCommunityComments = async (postId, params = {}) => {
  const { data } = await API.get(`/community/${postId}/comments`, { params });
  return data;
};

export const createCommunityComment = async (postId, content) => {
  const { data } = await API.post(`/community/${postId}/comments`, { content });
  return data;
};

export const toggleCommunityLike = async (postId) => {
  const { data } = await API.post(`/community/${postId}/like`);
  return data;
};

export const toggleCommunitySave = async (postId) => {
  const { data } = await API.post(`/community/${postId}/save`);
  return data;
};

export const shareCommunityPost = async (postId, platform = "copy") => {
  const { data } = await API.post(`/community/${postId}/share`, { platform });
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
  getCommunityComments,
  createCommunityComment,
  toggleCommunityLike,
  toggleCommunitySave,
  shareCommunityPost,
  deleteCommunityPost,
};

