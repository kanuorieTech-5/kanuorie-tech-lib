const cache = new Map();

export const cachedGet = async (key, fn) => {
  if (cache.has(key)) return cache.get(key);

  const res = await fn();
  cache.set(key, res);

  return res;
};

export const clearCache = (key) => {
  if (key) cache.delete(key);
  else cache.clear();
};
