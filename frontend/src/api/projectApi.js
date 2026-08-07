import API from "./axiosApi";

/* ==========================
   PROJECTS
========================== */

export const getProjects = async () => {
  const { data } = await API.get("/projects");
  return data;
};

export const getProject = async (id) => {
  const { data } = await API.get(`/projects/${id}`);
  return data;
};

export const createProject = async (project) => {
  const { data } = await API.post("/projects", project);
  return data;
};

export const updateProject = async (id, project) => {
  const { data } = await API.put(`/projects/${id}`, project);
  return data;
};

export const deleteProject = async (id) => {
  const { data } = await API.delete(`/projects/${id}`);
  return data;
};