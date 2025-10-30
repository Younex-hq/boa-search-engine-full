import axios, { type InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_LOGIN_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

authApi.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = Cookies.get("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.config.url !== "/login" &&
      (error.response?.status === 500 ||
        error.response?.data?.message === "Unauthenticated.")
    ) {
      const event = new CustomEvent("logout");
      window.dispatchEvent(event);
    }
    return Promise.reject(error);
  }
);

export default authApi;
