import axios from "axios";
import { getValue } from "../config/runtimeConfig";

const baseURL = 'https://shuttle.en1an.com'
const api = axios.create({
  baseURL: baseURL, // 初始为空
  timeout: 10000,
});

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

// ✅ 配置加载完后调用该函数，更新 baseURL
export const initApi = () => {
  const baseURL = getValue("baseUrl");
  api.defaults.baseURL = baseURL;
};

export default api;
