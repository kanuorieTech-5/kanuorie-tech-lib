import API from "./axiosApi";

/* ==========================================
   PUBLIC
========================================== */

export const getFAQs = async () => {
  const { data } = await API.get("/faq");
  return data;
};

/* ==========================================
   ADMIN
========================================== */

export const createFAQ = async (faq) => {
  const { data } = await API.post("/faq", faq);
  return data;
};

export const updateFAQ = async (id, faq) => {
  const { data } = await API.put(`/faq/${id}`, faq);
  return data;
};

export const deleteFAQ = async (id) => {
  const { data } = await API.delete(`/faq/${id}`);
  return data;
};

export const reorderFAQs = async (items) => {
  const { data } = await API.put("/faq/reorder", {
    items,
  });

  return data;
};
