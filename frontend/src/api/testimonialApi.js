import API from "./axiosApi";

/* ==========================================
   PUBLIC
========================================== */

export const getTestimonials = async () => {
  const { data } = await API.get("/testimonials");
  return data;
};

/* ==========================================
   ADMIN
========================================== */

export const createTestimonial = async (testimonial) => {
  const { data } = await API.post(
    "/testimonials",
    testimonial
  );

  return data;
};

export const updateTestimonial = async (
  id,
  testimonial
) => {
  const { data } = await API.put(
    `/testimonials/${id}`,
    testimonial
  );

  return data;
};

export const deleteTestimonial = async (id) => {
  const { data } = await API.delete(
    `/testimonials/${id}`
  );

  return data;
};