import API from "./axiosApi";

/* ==========================================
   PLATFORM OPERATIONS — READ RECORDS
========================================== */

const getItems = async (url, params = {}) => {
  const { data } = await API.get(url, { params });
  return data?.data?.items ?? [];
};

export const getOperationsAffiliates = () =>
  getItems("/admin/operations/affiliates");

export const getOperationsPayouts = (params = {}) =>
  getItems("/admin/operations/payouts", params);

export const getOperationsInquiries = (params = {}) =>
  getItems("/admin/operations/inquiries", params);

export const getOperationsEnrollments = () =>
  getItems("/admin/operations/enrollments");

export const getOperationsCertificates = () =>
  getItems("/admin/operations/certificates");

export const getOperationsPayments = (params = {}) =>
  getItems("/admin/operations/payments", params);

export const getOperationsIssues = (params = {}) =>
  getItems("/admin/operations/issues", params);

export const getOperationsFeedback = () =>
  getItems("/admin/operations/feedback");

export const getOperationsReports = (params = {}) =>
  getItems("/admin/operations/reports", params);

export const updateOperationsReportStatus = async (id, status) => {
  const { data } = await API.patch(
    `/admin/operations/reports/${id}/status`,
    { status }
  );

  return data;
};

/* ==========================================
   PLATFORM OPERATIONS — SUPPORTED ACTIONS
========================================== */

export const updateOperationsAffiliateStatus = async (id, status) => {
  const { data } = await API.patch(
    `/admin/operations/affiliates/${id}/status`,
    { status }
  );

  return data;
};

export const updateOperationsPayoutStatus = async (
  id,
  { status, reference, rejectionReason }
) => {
  const { data } = await API.patch(
    `/admin/operations/payouts/${id}/status`,
    { status, reference, rejectionReason }
  );

  return data;
};

export const updateOperationsInquiryStatus = async (id, status) => {
  const { data } = await API.patch(
    `/admin/operations/inquiries/${id}/status`,
    { status }
  );

  return data;
};

export const updateOperationsIssueStatus = async (id, status) => {
  const { data } = await API.patch(
    `/admin/operations/community-reports/${id}/status`,
    { status }
  );

  return data;
};