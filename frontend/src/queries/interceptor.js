import axios from "axios";
import { queryClient } from "./queryClient";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_HOST,
  headers: { "Content-Type": "application/json" },
});

let logoutCallback = null;

export const setLogoutCallback = (cb) => {
  logoutCallback = cb;
};

async function refreshTokenFunction() {
  let refreshToken = null;
  try {
    refreshToken = JSON.parse(localStorage.getItem("refresh_token"));
  } catch {}
  if (!refreshToken) return Promise.reject();

  const refreshAxios = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_HOST + "auth/refresh",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${refreshToken}`,
    },
  });

  try {
    const res = await refreshAxios.post();
    if (res?.data?.access_token) {
      localStorage.setItem("token", JSON.stringify(res.data.access_token));
      queryClient.invalidateQueries(["datasets"]);
      queryClient.invalidateQueries(["documents"]);
      queryClient.invalidateQueries(["tools"]);
      return res.data.access_token;
    }
    return Promise.reject();
  } catch (err) {
    return Promise.reject(err);
  }
}

// Request interceptor για να βάζουμε το Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor με retry

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.data?.detail ===
        "Token time expired: Signature has expired." &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshTokenFunction();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        logoutCallback?.(); // εδώ καλείς το logout
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
