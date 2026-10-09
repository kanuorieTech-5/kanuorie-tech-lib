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
   ADMIN CREATE
========================================== */

export const createTeamMember = async (member) => {
  const formData = new FormData();

  Object.entries(member).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key === "image" && value instanceof File) {
        formData.append("image", value);
      } else {
        formData.append(key, value);
      }
    }
  });

  const { data } = await API.post("/team", formData);

  return data;
};

/* ==========================================
   ADMIN UPDATE
========================================== */

export const updateTeamMember = async (id, member) => {
  const formData = new FormData();

  Object.entries(member).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key === "image" && value instanceof File) {
        formData.append("image", value);
      } else {
        formData.append(key, value);
      }
    }
  });

  const { data } = await API.put(
    `/team/${id}`,
    formData
  );

  return data;
};

/* ==========================================
   ADMIN DELETE
========================================== */

export const deleteTeamMember = async (id) => {
  const { data } = await API.delete(`/team/${id}`);

  return data;
};


/* ==========================================
   ADMIN TEAM STATISTICS
========================================== */

export const getTeamStats = async () => {
  const { data } = await API.get("/team/stats");

  return data;
};