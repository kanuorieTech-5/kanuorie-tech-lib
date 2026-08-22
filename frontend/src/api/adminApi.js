import API from "./axiosApi";

/* =====================================================
   ADMIN DASHBOARD
===================================================== */

export const getAdminDashboard = async () => {
  const { data } = await API.get("/admin/dashboard");
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
  const { data } = await API.get("/admin/users", {
    params,
  });

  return data;
};

export const getAdminUser = async (id) => {
  const { data } = await API.get(
    `/admin/users/${id}`
  );

  return data;
};

export const updateUserRole = async (id, role) => {
  const { data } = await API.put(
    `/admin/users/${id}/role`,
    { role }
  );

  return data;
};

export const deleteAdminUser = async (id) => {
  const { data } = await API.delete(
    `/admin/users/${id}`
  );

  return data;
};

/* =====================================================
   BOOKS
===================================================== */

export const getAdminBooks = async (params = {}) => {
  const { data } = await API.get("/admin/books", {
    params,
  });

  return data;
};

export const createAdminBook = async (bookData) => {
  const { data } = await API.post(
    "/admin/books",
    bookData
  );

  return data;
};

export const updateAdminBook = async (
  id,
  bookData
) => {
  const { data } = await API.put(
    `/admin/books/${id}`,
    bookData
  );

  return data;
};

export const deleteAdminBook = async (id) => {
  const { data } = await API.delete(
    `/admin/books/${id}`
  );

  return data;
};

/* =====================================================
   SERVICES
===================================================== */

export const getAdminServices = async (params = {}) => {
  const { data } = await API.get("/admin/services", {
    params,
  });

  return data;
};

export const createAdminService = async (serviceData) => {
  const { data } = await API.post(
    "/admin/services",
    serviceData
  );

  return data;
};

export const updateAdminService = async (
  id,
  serviceData
) => {
  const { data } = await API.put(
    `/admin/services/${id}`,
    serviceData
  );

  return data;
};

export const deleteAdminService = async (id) => {
  const { data } = await API.delete(
    `/admin/services/${id}`
  );

  return data;
};

/* =====================================================
   TEAM
===================================================== */

export const getAdminTeam = async () => {
  const { data } = await API.get("/admin/team");
  return data;
};

export const createTeamMember = async (memberData) => {
  const { data } = await API.post(
    "/admin/team",
    memberData
  );

  return data;
};

export const updateTeamMember = async (id, memberData) => {
  const { data } = await API.put(
    `/admin/team/${id}`,
    memberData
  );

  return data;
};

export const deleteTeamMember = async (id) => {
  const { data } = await API.delete(
    `/admin/team/${id}`
  );

  return data;
};

/* =====================================================
   TESTIMONIALS
===================================================== */

export const getAdminTestimonials = async () => {
  const { data } = await API.get(
    "/admin/testimonials"
  );

  return data;
};

export const createTestimonial = async (testimonialData) => {
  const { data } = await API.post(
    "/admin/testimonials",
    testimonialData
  );

  return data;
};

export const updateTestimonial = async (
  id,
  testimonialData
) => {
  const { data } = await API.put(
    `/admin/testimonials/${id}`,
    testimonialData
  );

  return data;
};

export const deleteTestimonial = async (id) => {
  const { data } = await API.delete(
    `/admin/testimonials/${id}`
  );

  return data;
};

/* =====================================================
   BLOG
===================================================== */
export const getAdminBlogs = async (params = {}) => {
  const { data } = await API.get("/admin/blog", {
    params,
  });

  return data;
};

export const createAdminBlog = async (blogData) => {
  const { data } = await API.post(
    "/admin/blog",
    blogData
  );

  return data;
};

export const updateAdminBlog = async (
  id,
  blogData
) => {
  const { data } = await API.put(
    `/admin/blog/${id}`,
    blogData
  );

  return data;
};

export const deleteAdminBlog = async (id) => {
  const { data } = await API.delete(
    `/admin/blog/${id}`
  );

  return data;
};

/* =====================================================
   ORDERS
===================================================== */

export const getAdminOrders = async (params = {}) => {
  const { data } = await API.get("/admin/orders", {
    params,
  });

  return data;
};

export const getAdminOrder = async (id) => {
  const { data } = await API.get(
    `/admin/orders/${id}`
  );

  return data;
};

export const updateOrderStatus = async (
  id,
  status
) => {
  const { data } = await API.put(
    `/admin/orders/${id}/status`,
    { status }
  );

  return data;
};

/* =====================================================
   CONTACTS
===================================================== */

export const getAdminContacts = async (params = {}) => {
  const { data } = await API.get("/admin/contacts", {
    params,
  });

  return data;
};

export const updateContactStatus = async (
  id,
  status
) => {
  const { data } = await API.put(
    `/admin/contacts/${id}/status`,
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
    "/notifications/admin",
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