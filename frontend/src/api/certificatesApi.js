import API from "./axiosApi";

/* ==========================================
   CERTIFICATE API
========================================== */

export const getCertificates = async () => {
  const { data } = await API.get("/certificates");
  return data;
};

export const getCertificate = async (certificateId) => {
  const { data } = await API.get(
    `/certificates/${certificateId}`
  );

  return data;
};

export const verifyCertificate = async (certificateId) => {
  const { data } = await API.get(
    `/certificates/verify/${certificateId}`
  );

  return data;
};

export default {
  getCertificates,
  getCertificate,
  verifyCertificate,
};
