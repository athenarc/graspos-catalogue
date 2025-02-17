import axios from "axios";

import { useAuth } from "../components/AuthContext";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_HOST,
  timeout: 1000,
  headers: { "Content-Type": "application/json" },
});
axiosInstance.interceptors.request.use(
  function (config) {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response && error.response.status === 401) {
      // localStorage.clear();
      // window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
