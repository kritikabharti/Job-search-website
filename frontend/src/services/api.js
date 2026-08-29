import axios from "axios";

const configuredBaseUrl =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const normalizedBaseUrl = configuredBaseUrl
  .trim()
  .replace(/\/+$/, "")
  .replace(/\/api\/api$/i, "/api");

const api = axios.create({
  baseURL: normalizedBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("token");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    // All application requests are written relative to /api.
    // This also prevents accidental /api/api/... URLs.
    if (typeof config.url === "string") {
      config.url = config.url.replace(/^\/(?:api\/)+/i, "/");
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
