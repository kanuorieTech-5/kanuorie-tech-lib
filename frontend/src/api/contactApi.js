import API from "./axiosApi";

/* CONTACT */

export const sendContactMessage = async (message) => {
  const { data } = await API.post("/contact", message);
  return data;
};

/* PUBLIC SERVICE ENQUIRIES */

export const submitServiceEnquiry = async (enquiry) => {
  const { data } = await API.post("/contact/service-enquiries", enquiry);
  return data;
};

/* ADMIN SERVICE ENQUIRIES */

export const getAdminServiceEnquiries = async (params = {}) => {
  const { data } = await API.get("/contact/service-enquiries", { params });
  return data;
};

export const getAdminServiceEnquiryStats = async () => {
  const { data } = await API.get("/contact/service-enquiries/stats");
  return data;
};

export const updateAdminServiceEnquiryStatus = async (id, status) => {
  const { data } = await API.patch(
    `/contact/service-enquiries/${id}/status`,
    { status }
  );
  return data;
};

export const submitContactReport = async (report) => {
  const { data } = await API.post("/contact/reports", report);
  return data;
};