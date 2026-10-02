import API from "./axiosApi";

/* ==========================================
   GET APPLICATION STATISTICS
========================================== */

export const getCareerApplicationStats = async () => {
  const { data } = await API.get("/career-applications/stats");

  return data;
};

/* ==========================================
   GET APPLICATIONS
========================================== */

export const getCareerApplications = async (params = {}) => {
  const { data } = await API.get("/career-applications", {
    params,
  });

  return data;
};

/* ==========================================
   GET SINGLE APPLICATION
========================================== */

export const getCareerApplication = async (id) => {
  const { data } = await API.get(`/career-applications/${id}`);

  return data;
};

/* ==========================================
   UPDATE STATUS
========================================== */

export const updateCareerApplicationStatus = async (id, status) => {
  const { data } = await API.patch(
    `/career-applications/${id}/status`,
    { status },
  );

  return data;
};

/* ==========================================
   UPDATE NOTES
========================================== */

export const updateCareerApplicationNotes = async (id, notes) => {
  const { data } = await API.patch(
    `/career-applications/${id}/notes`,
    { notes },
  );

  return data;
};

/* ==========================================
   MARK AS READ
========================================== */

export const markCareerApplicationRead = async (id) => {
  const { data } = await API.patch(
    `/career-applications/${id}/read`,
  );

  return data;
};

/* ==========================================
   MARK AS UNREAD
========================================== */

export const markCareerApplicationUnread = async (id) => {
  const { data } = await API.patch(
    `/career-applications/${id}/unread`,
  );

  return data;
};

/* ==========================================
   DELETE APPLICATION
========================================== */

export const deleteCareerApplication = async (id) => {
  const { data } = await API.delete(
    `/career-applications/${id}`,
  );

  return data;
};
