import axios from "axios";

const configured = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").trim().replace(/\/+$/, "");
const baseURL = /\/api$/i.test(configured) ? configured : `${configured}/api`;

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || localStorage.getItem("accessToken") || sessionStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (typeof config.url === "string") config.url = config.url.replace(/^(?:\/api\/)+/i, "/");

  if (typeof FormData !== "undefined" && config.data instanceof FormData) {
    delete config.headers?.["Content-Type"];
    delete config.headers?.["content-type"];
  } else {
    config.headers = config.headers || {};
    config.headers["Content-Type"] ||= "application/json";
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && error.config?.url !== "/auth/login") {
      // Do not redirect here; pages decide where the user should go.
      // This keeps profile/forms from losing their current UI unexpectedly.
    }
    return Promise.reject(error);
  }
);

export default api;
