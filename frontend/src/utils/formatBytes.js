export const formatBytes = (bytes, decimals = 2) => {
  if (!bytes) return "0 Bytes";

  const sizes = ["Bytes", "KB", "MB", "GB"];

  const index = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${parseFloat(
    (bytes / Math.pow(1024, index)).toFixed(decimals),
  )} ${sizes[index]}`;
};
