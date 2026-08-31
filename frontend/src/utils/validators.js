export const isEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isStrongPassword = (password) =>
  /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(password);

export const required = (value) => Boolean(String(value).trim());
