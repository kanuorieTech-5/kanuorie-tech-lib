import API from "./axiosApi";

/* ==========================================
   PRODUCTS
========================================== */

/**
 * Get all products
 */
export const getProducts = async (params = {}) => {
  const { data } = await API.get("/products", {
    params,
  });

  return data;
};

/**
 * Get a single product
 */
export const getProduct = async (id) => {
  const { data } = await API.get(`/products/${id}`);

  return data;
};

/**
 * Create a product
 */
export const createProduct = async (productData) => {
  const { data } = await API.post("/products", productData);

  return data;
};

/**
 * Update a product
 */
export const updateProduct = async (id, productData) => {
  const { data } = await API.put(`/products/${id}`, productData);

  return data;
};

/**
 * Delete a product
 */
export const deleteProduct = async (id) => {
  const { data } = await API.delete(`/products/${id}`);

  return data;
};

/**
 * Get featured products
 */
export const getFeaturedProducts = async () => {
  const { data } = await API.get("/products/featured");

  return data;
};

/**
 * Get product statistics
 */
export const getProductStats = async () => {
  const { data } = await API.get("/products/stats");

  return data;
};
