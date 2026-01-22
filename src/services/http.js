import axios from "axios";
import { API_BASE } from "./api.js";

const http = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

export default http;
