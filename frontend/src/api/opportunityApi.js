import API from "./axiosApi";

export const getAdminOpportunities = async (params = {}) => {
  const { data } = await API.get("/admin/opportunities", { params });
  return data;
};

export const createAdminOpportunity = async (payload) => {
  const { data } = await API.post("/admin/opportunities", payload);
  return data;
};

export const updateAdminOpportunity = async (id, payload) => {
  const { data } = await API.put(`/admin/opportunities/${id}`, payload);
  return data;
};

export const deleteAdminOpportunity = async (id) => {
  const { data } = await API.delete(`/admin/opportunities/${id}`);
  return data;
};

export const getPublicOpportunities = async (params = {}) => {
  const { data } = await API.get("/opportunities", { params });
  return data;
};

export const getPublicOpportunity = async (idOrSlug) => {
  const { data } = await API.get(
    `/opportunities/${encodeURIComponent(idOrSlug)}`
  );
  return data;
};