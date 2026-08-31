import API from "./axiosApi";

/* ==========================================
   PUBLIC
========================================== */

export const subscribeNewsletter = async (email) => {
  const { data } = await API.post("/newsletter", {
    email,
  });

  return data;
};

/* ==========================================
   ADMIN
========================================== */

export const getSubscribers = async () => {
  const { data } = await API.get("/newsletter");
  return data;
};

export const deleteSubscriber = async (id) => {
  const { data } = await API.delete(`/newsletter/${id}`);

  return data;
};
