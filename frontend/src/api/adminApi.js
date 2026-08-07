import API from "./axiosApi";

/* ==========================
   ADMIN
========================== */

export const getDashboardStats = async () => {
  const { data } = await API.get("/admin/dashboard");
  return data;
};

export const getUsers = async () => {
  const { data } = await API.get("/admin/users");
  return data;
};

export const updateUserRole = async (id, role) => {
  const { data } = await API.put(`/admin/users/${id}/role`, {
    role,
  });

  return data;
};

export const deleteUser = async (id) => {
  const { data } = await API.delete(`/admin/users/${id}`);
  return data;
};