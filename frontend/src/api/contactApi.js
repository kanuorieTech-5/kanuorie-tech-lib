import API from "./axiosApi";

/* ==========================
   CONTACT
========================== */

export const sendContactMessage = async (message) => {
  const { data } = await API.post("/contact", message);
  return data;
};
