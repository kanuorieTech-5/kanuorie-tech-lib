import API from "./axiosApi";

/* ==========================================
   PUBLIC
========================================== */

export const getTeamMembers = async (params = {}) => {
  const { data } = await API.get("/team", {
    params,
  });

  return data;
};

export const getFeaturedTeamMembers = async () => {
  const { data } = await API.get("/team/featured");

  return data;
};

/* ==========================================
   ADMIN
========================================== */

export const getTeamStats = async () => {
  const { data } = await API.get("/team/stats");

  return data;
};

export const createTeamMember = async (member) => {
  const { data } = await API.post("/team", member);

  return data;
};

export const updateTeamMember = async (id, member) => {
  const { data } = await API.put(`/team/${id}`, member);

  return data;
};

export const deleteTeamMember = async (id) => {
  const { data } = await API.delete(`/team/${id}`);

  return data;
};

export const reorderTeamMembers = async (items) => {
  const { data } = await API.put("/team/reorder", {
    items,
  });

  return data;
};
