import API from "./axiosApi";

/* ==========================================
   PROJECTS
========================================== */

/**
 * Get all projects
 *
 * Supports:
 * - page
 * - limit
 * - search
 * - featured
 */
export const getProjects = async (params = {}) => {
  const { data } = await API.get("/projects", {
    params,
  });

  return data;
};

/**
 * Get a single project
 */
export const getProject = async (id) => {
  const { data } = await API.get(`/projects/${id}`);

  return data;
};

/**
 * Create a project
 * Admin only
 */
export const createProject = async (projectData) => {
  const { data } = await API.post(
    "/projects",
    projectData
  );

  return data;
};

/**
 * Update a project
 * Admin only
 */
export const updateProject = async (
  id,
  projectData
) => {
  const { data } = await API.put(
    `/projects/${id}`,
    projectData
  );

  return data;
};

/**
 * Delete a project
 * Admin only
 */
export const deleteProject = async (id) => {
  const { data } = await API.delete(
    `/projects/${id}`
  );

  return data;
};

export default {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
};