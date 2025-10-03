// src/services/api.js
import axios from "axios";
import { getToken, removeToken } from "../utils/auth";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

API.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      alert("Session expired. Please log in again.");
      removeToken();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;
