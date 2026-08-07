import API from "./axiosApi";

/* ==========================
   CLOUDINARY UPLOAD
========================== */

export const uploadImage = async (file) => {
  const formData = new FormData();

  formData.append("image", file);

  const { data } = await API.post("/upload/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const deleteImage = async (publicId) => {
  const { data } = await API.delete(`/upload/${publicId}`);
  return data;
};