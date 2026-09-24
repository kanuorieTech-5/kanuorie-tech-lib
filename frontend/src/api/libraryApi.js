import API from "./axiosApi";

/* ==========================================
   GET SAVED RESOURCES
========================================== */

export const getSavedResources = async () => {
  const { data } = await API.get("/library/saved");

  return data;
};

/* ==========================================
   SAVE RESOURCE
========================================== */

export const saveResource = async (resource) => {
  const { data } = await API.post("/library/saved", resource);

  return data;
};

/* ==========================================
   REMOVE SAVED RESOURCE
========================================== */

export const removeSavedResource = async (resourceId, resourceType) => {
  const { data } = await API.delete(`/library/saved/${resourceId}`, {
    params: {
      resourceType,
    },
  });

  return data;
};

/* ==========================================
   CHECK SAVED RESOURCE
========================================== */

export const checkSavedResource = async (resourceId, resourceType) => {
  const { data } = await API.get(`/library/saved/${resourceId}`, {
    params: {
      resourceType,
    },
  });

  return data;
};

export default {
  getSavedResources,
  saveResource,
  removeSavedResource,
  checkSavedResource,
};
