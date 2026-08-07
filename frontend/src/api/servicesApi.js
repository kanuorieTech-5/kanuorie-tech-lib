import API from "./axiosApi";

/* ==========================
   SERVICES
========================== */

export const getServices = async () => {
  const { data } = await API.get("/services");
  return data;
};

export const getService = async (id) => {
  const { data } = await API.get(`/services/${id}`);
  return data;
};

export const createService = async (service) => {
  const { data } = await API.post("/services", service);
  return data;
};

export const updateService = async (id, service) => {
  const { data } = await API.put(`/services/${id}`, service);
  return data;
};

export const deleteService = async (id) => {
  const { data } = await API.delete(`/services/${id}`);
  return data;
};