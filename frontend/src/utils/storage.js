export const setStorage = (
  key,
  value
) => {
  localStorage.setItem(
    key,
    JSON.stringify(value)
  );
};


export const getStorage = (key) => {
  const item =
    localStorage.getItem(key);

  return item
    ? JSON.parse(item)
    : null;
};


export const removeStorage = (key) => {
  localStorage.removeItem(key);
};


export const clearStorage = () => {
  localStorage.clear();
};