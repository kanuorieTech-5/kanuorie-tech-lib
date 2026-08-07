export const validateFileSize = (
  file,
  maxSize
) => {
  return file.size <= maxSize;
};


export const validateFileType = (
  file,
  allowedTypes = []
) => {
  return allowedTypes.includes(
    file.type
  );
};


export const createFormData = (
  data
) => {
  const formData = new FormData();

  Object.entries(data).forEach(
    ([key, value]) => {
      formData.append(
        key,
        value
      );
    }
  );

  return formData;
};