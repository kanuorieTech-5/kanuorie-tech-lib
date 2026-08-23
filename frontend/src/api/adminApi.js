import API from "./axiosApi";

/* =====================================================
   ADMIN DASHBOARD
===================================================== */

export const getAdminDashboard = async () => {
  const { data } = await API.get("/admin/stats");
  return data;
};

export const getAdminAnalytics = async (params = {}) => {
  const { data } = await API.get("/admin/analytics", {
    params,
  });

  return data;
};
/* =====================================================
   USERS
===================================================== */

export const getAdminUsers = async (params = {}) => {
  const { data } = await API.get("/users", {
    params,
  });

  return data;
};

export const getAdminUser = async (id) => {
  const { data } = await API.get(
    `/users/${id}`
  );

  return data;
};

export const updateUserRole = async (id, role) => {
  const { data } = await API.put(
    `/users/${id}/role`,
    { role }
  );

  return data;
};

export const deleteAdminUser = async (id) => {
  const { data } = await API.delete(
    `/users/${id}`
  );

  return data;
};

/* =====================================================
   BOOKS
===================================================== */

export const getAdminBooks = async (params = {}) => {
  const { data } = await API.get(
    `/books?${params.toString()}`
  );

  return data;
};

export const createAdminBook = async (bookData) => {
  const { data } = await API.post(
    "/books",
    bookData
  );

  return data;
};

export const updateAdminBook = async (
  id,
  bookData
) => {
  const { data } = await API.put(
    `/books/${id}`,
    bookData
  );

  return data;
};

export const deleteAdminBook = async (id) => {
  const { data } = await API.delete(
    `/books/${id}`
  );

  return data;
};

/* =====================================================
   SERVICES
===================================================== */

export const getAdminServices = async () => {
  const response = await API.get("/services");
  return response.data;
};


export const createAdminService = async (data) => {
  const response = await API.post("/services", data);
  return response.data;
};


export const updateAdminService = async (id, data) => {
  const response = await API.put(`/services/${id}`, data);
  return response.data;
};


export const deleteAdminService = async (id) => {
  const response = await API.delete(`/services/${id}`);
  return response.data;
};

/* =====================================================
   TEAM
===================================================== */

export const getAdminTeam = async () => {
  const { data } = await API.get("/team");
  return data;
};

export const createTeamMember = async (memberData) => {
  const { data } = await API.post(
    "/team",
    memberData
  );

  return data;
};

export const updateTeamMember = async (id, memberData) => {
  const { data } = await API.put(
    `/team/${id}`,
    memberData
  );

  return data;
};

export const deleteTeamMember = async (id) => {
  const { data } = await API.delete(
    `/team/${id}`
  );

  return data;
};

/* =====================================================
   TESTIMONIALS
===================================================== */

export const getAdminTestimonials = async () => {
  const { data } = await API.get(
    "/testimonials"
  );

  return data;
};

export const createTestimonial = async (testimonialData) => {
  const { data } = await API.post(
    "/testimonials",
    testimonialData
  );

  return data;
};

export const updateTestimonial = async (
  id,
  testimonialData
) => {
  const { data } = await API.put(
    `/testimonials/${id}`,
    testimonialData
  );

  return data;
};

export const deleteTestimonial = async (id) => {
  const { data } = await API.delete(
    `/testimonials/${id}`
  );

  return data;
};

/* =====================================================
   BLOG
===================================================== */
export const getAdminBlogs = async (params = {}) => {
  const { data } = await API.get("/blog", {
    params,
  });

  return data;
};

export const createAdminBlog = async (blogData) => {
  const { data } = await API.post(
    "/blog",
    blogData
  );

  return data;
};

export const updateAdminBlog = async (
  id,
  blogData
) => {
  const { data } = await API.put(
    `/blog/${id}`,
    blogData
  );

  return data;
};

export const deleteAdminBlog = async (id) => {
  const { data } = await API.delete(
    `/blog/${id}`
  );

  return data;
};

/* =====================================================
   ORDERS
===================================================== */

export const getAdminOrders = async (params = {}) => {
  const { data } = await API.get("/orders", {
    params,
  });

  return data;
};

export const getAdminOrder = async (id) => {
  const { data } = await API.get(
    `/orders/${id}`
  );

  return data;
};

export const updateOrderStatus = async (
  id,
  status
) => {
  const { data } = await API.put(
    `/orders/${id}/status`,
    { status }
  );

  return data;
};

/* =====================================================
   CONTACTS
===================================================== */

export const getAdminContacts = async (params = {}) => {
  const { data } = await API.get("/contacts", {
    params,
  });

  return data;
};

export const updateContactStatus = async (
  id,
  status
) => {
  const { data } = await API.put(
    `/contacts/${id}/status`,
    { status }
  );

  return data;
};

/* =====================================================
   NEWSLETTER
===================================================== */

export const getSubscribers = async (params = {}) => {
  const { data } = await API.get("/newsletter", {
    params,
  });

  return data;
};

export const deleteSubscriber = async (id) => {
  const { data } = await API.delete(
    `/newsletter/${id}`
  );

  return data;
};

/* =====================================================
   NOTIFICATIONS
===================================================== */

export const getAdminNotifications = async (
  params = {}
) => {
  const { data } = await API.get(
    "/notifications",
    { params }
  );

  return data;
};

export const createAdminNotification = async (
  notificationData
) => {
  const { data } = await API.post(
    "/notifications",
    notificationData
  );

  return data;
};

export const broadcastNotification = async (
  notificationData
) => {
  const { data } = await API.post(
    "/notifications/broadcast",
    notificationData
  );

  return data;
};

export const deleteAdminNotification = async (
  id
) => {
  const { data } = await API.delete(
    `/notifications/admin/${id}`
  );

  return data;
};