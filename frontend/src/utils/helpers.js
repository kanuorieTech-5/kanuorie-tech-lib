export const classNames = (...classes) => classes.filter(Boolean).join(" ");

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const capitalize = (text = "") =>
  text.charAt(0).toUpperCase() + text.slice(1);

export const generateId = () => crypto.randomUUID();
