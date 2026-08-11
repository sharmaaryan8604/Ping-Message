import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? API_BASE_URL
      : "/api",

  withCredentials: true,
});