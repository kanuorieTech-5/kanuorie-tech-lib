import API from "./axiosApi";

export const uploadImage = async (file) => {
  if (!file) {
    throw new Error("No image file selected.");
  }

  const formData = new FormData();

  formData.append("image", file);

  const { data } = await API.post("/upload/image", formData);

  return data;
};

export const deleteImage = async (publicId) => {
  const { data } = await API.delete(`/upload/${encodeURIComponent(publicId)}`);

  return data;
};
