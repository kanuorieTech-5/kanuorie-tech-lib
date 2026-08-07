export const formatDate = (
  date,
  options = {}
) => {
  if (!date) return "";

  return new Intl.DateTimeFormat(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
      ...options,
    }
  ).format(new Date(date));
};


export const formatDateTime = (date) => {
  if (!date) return "";

  return new Intl.DateTimeFormat(
    "en-US",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  ).format(new Date(date));
};


export const timeAgo = (date) => {
  if (!date) return "";

  const seconds =
    Math.floor(
      (new Date() - new Date(date)) / 1000
    );

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const key in intervals) {
    const value = Math.floor(
      seconds / intervals[key]
    );

    if (value >= 1) {
      return `${value} ${key}${
        value > 1 ? "s" : ""
      } ago`;
    }
  }

  return "Just now";
};