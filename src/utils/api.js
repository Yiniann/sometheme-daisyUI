import axios from "axios";
import { getValue } from "../config/runtimeConfig";

const api = axios.create({
  baseURL: "",
  timeout: 10000,
});

export const initApi = () => {
  const baseURL = import.meta.env.DEV
    ? getValue("devUrl")
    : "";
  api.defaults.baseURL = baseURL;
};

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const authData = localStorage.getItem("authData");
    if (authData) {
      config.headers["Authorization"] = JSON.parse(authData);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 响应拦截器
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;