import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api"; // Change this to your backend URL

export const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

// Authentication APIs
export const login = (data) => api.post("/admin/login", data);
export const register = (data) => api.post("/admin/register", data);
export const logout = () => api.post("/admin/logout");

// Book APIs
export const getBooks = () => api.get("/books");
export const addBook = (bookData) => api.post("/books", bookData);
export const updateBook = (id, bookData) => api.put(`/books/${id}`, bookData);
export const deleteBook = (id) => api.delete(`/books/${id}`);
