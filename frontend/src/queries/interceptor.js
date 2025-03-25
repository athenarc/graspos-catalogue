import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_HOST,
  headers: { "Content-Type": "application/json" },
});
async function refreshTokenFunction() {
  var token = null;
  try {
    token = JSON.parse(localStorage.getItem("refresh_token"));
  } catch (err) {
    return err;
  }
  const refreshToken = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_HOST + "auth/refresh",
    timeout: 1000,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const refreshTokenCall = await refreshToken.post();
  if (refreshTokenCall?.data?.access_token) {
    localStorage.removeItem("token");
    localStorage.setItem(
      "token",
      JSON.stringify(refreshTokenCall.data.access_token)
    );
    return Promise.resolve();
  } else {
    return Promise.reject();
  }
}
axiosInstance.interceptors.request.use(
  function (config) {
    var token = null;
    try {
      token = JSON.parse(localStorage.getItem("token"));
    } catch (err) {}
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
  async function (error) {
    if (
      error?.response?.data?.detail ==
      "Token time expired: Signature has expired."
    ) {
      refreshTokenFunction();
    }

    return Promise.reject(error);
  }
);
export default axiosInstance;
