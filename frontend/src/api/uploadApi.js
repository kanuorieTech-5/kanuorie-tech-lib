import API from "./axiosApi";

/* ==========================================
   IMAGE UPLOAD
========================================== */

export const uploadImage = async (file, folder = "") => {
  if (!file) {
    throw new Error("No image file selected.");
  }

  const formData = new FormData();

  formData.append("image", file);

  if (folder) {
    formData.append("folder", folder);
  }

  const { data } = await API.post("/upload/image", formData);

  return data;
};

/* ==========================================
   ASSESSMENT FILE UPLOAD
========================================== */

export const uploadAssessmentFile = async (file) => {
  if (!file) {
    throw new Error("No assessment file selected.");
  }

  const formData = new FormData();

  formData.append("file", file);

  const { data } = await API.post("/upload/assessment", formData);

  return data;
};

/* ==========================================
   DELETE FILE
========================================== */

export const deleteImage = async (publicId) => {
  if (!publicId) {
    throw new Error("Public ID is required.");
  }

  const { data } = await API.delete(`/upload/${encodeURIComponent(publicId)}`);

  return data;
};

export default {
  uploadImage,
  uploadAssessmentFile,
  deleteImage,
};
