import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { getRefreshToken } from "../hooks/user.actions";

// ✅ Central Axios client for Django API
const axiosService = axios.create({
  baseURL: "http://localhost:8000/api", // Django backend
  headers: { "Content-Type": "application/json" },
});

// ✅ Separate Axios client for Node.js API
export const nodeAxios = axios.create({
  baseURL: "http://localhost:5000", // Node backend
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  },
});


// ✅ Attach access token to Django requests
axiosService.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  config.headers = config.headers || {};

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  } else {
    delete config.headers["Authorization"];
  }

  console.log("AXIOS REQUEST:", `${config.baseURL}${config.url}`);
  console.log("AXIOS AUTH HEADER:", config.headers["Authorization"]);

  return config;
});

// ✅ Refresh token logic for Django
const refreshAuthLogic = async (failedRequest) => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw new Error("No refresh token available");

    const response = await axios.post(
      "http://localhost:8000/api/auth/refresh/",
      { refresh: refreshToken }
    );

    const { access, refresh } = response.data;

    // Save new tokens
    localStorage.setItem("access", access);
    if (refresh) localStorage.setItem("refresh", refresh);

    // Update failed request with new access token
    failedRequest.response.config.headers["Authorization"] = `Bearer ${access}`;

    return Promise.resolve();
  } catch (error) {
    // Clear tokens and redirect to login
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    window.location.href = "/login";
    return Promise.reject(error);
  }
};

// ✅ Attach refresh interceptor
createAuthRefreshInterceptor(axiosService, refreshAuthLogic);

// ✅ Helpers for SWR
export const fetcher = (url) => {
  console.log("[FETCHER] Requesting:", url);

  return axiosService
    .get(url)
    .then((res) => {
      console.log("[FETCHER] Response status:", res.status);
      console.log("[FETCHER] Response data:", res.data);
      return res.data;
    })
    .catch((err) => {
      console.error("[FETCHER] Error fetching:", url, err);
      throw err;
    });
};

export const fetchUser = (url) =>
  axiosService.get(url).then((res) => res.data);

// ✅ Export for direct use (e.g. POST /cart/add/)
export const authAxios = axiosService;

// ✅ Export Node client for testing Node.js backend
export const nodeFetcher = (url) =>
  nodeAxios.get(url).then((res) => res.data);

export default axiosService;

