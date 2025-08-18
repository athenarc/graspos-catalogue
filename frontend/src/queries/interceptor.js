import axios from "axios";
import { queryClient } from "./queryClient";

// Δημιουργούμε instance
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_HOST,
  headers: { "Content-Type": "application/json" },
});

// Συνάρτηση για refresh token
async function refreshTokenFunction() {
  let refreshToken = null;
  try {
    refreshToken = JSON.parse(localStorage.getItem("refresh_token"));
  } catch (err) {
    return Promise.reject(err);
  }

  if (!refreshToken) return Promise.reject(new Error("No refresh token"));

  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_HOST}auth/refresh`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );

    if (response?.data?.access_token) {
      const newToken = response.data.access_token;
      localStorage.setItem("token", JSON.stringify(newToken));

      // Ενημέρωση cache queries
      queryClient.invalidateQueries([
        "Datasets",
        "Documents",
        "Tools",
        "Services",
      ]);

      return newToken;
    } else {
      return Promise.reject(new Error("Refresh token failed"));
    }
  } catch (err) {
    return Promise.reject(err);
  }
}

// Request interceptor για να προσθέτουμε token
axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch (err) {}
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor με retry
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Αν το token λήξει και δεν έχουμε retry
    if (
      error?.response?.data?.detail ===
        "Token time expired: Signature has expired." &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshTokenFunction();
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

        // Επαναλαμβάνουμε το αρχικό request
        return axiosInstance(originalRequest);
      } catch (err) {
        // Αν αποτύχει η ανανέωση -> redirect στο login
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
