import API from "./axiosApi";

/* ==========================
   BOOKS
========================== */

export const getBooks = async (config = {}) => {
  const { data } = await API.get("/books", config);

  return data;
};

export const getBook = async (id) => {
  const { data } = await API.get(`/books/${id}`);

  return data;
};

export const createBook = async (book) => {
  const { data } = await API.post("/books", book);

  return data;
};

export const updateBook = async (id, book) => {
  const { data } = await API.put(`/books/${id}`, book);

  return data;
};

export const deleteBook = async (id) => {
  const { data } = await API.delete(`/books/${id}`);

  return data;
};

export const getCategories = async () => {
  const { data } = await API.get("/books/categories");

  return data;
};
