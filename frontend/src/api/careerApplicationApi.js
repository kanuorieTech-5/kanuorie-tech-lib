import API from "./axiosApi";

/* ==========================
   CAREER APPLICATIONS
========================== */

/**
 * Submit a career application
 *
 * @param {Object} application
 * @param {string} application.fullName
 * @param {string} application.email
 * @param {string} application.position
 * @param {string} application.portfolio
 * @param {string} application.coverLetter
 */
export const submitCareerApplication = async (application) => {
  const { data } = await API.post(
    "/career-applications",
    application,
  );

  return data;
};

