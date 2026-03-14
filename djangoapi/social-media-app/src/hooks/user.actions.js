import axios from "axios";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";

const baseURL = "http://localhost:8000/api";

// LocalStorage helpers
function getUser() {
  const auth = JSON.parse(localStorage.getItem("auth")) || null;
  return auth ? auth.user : null;
}

function getAccessToken() {
  const auth = JSON.parse(localStorage.getItem("auth"));
  return auth?.access;
}

function getRefreshToken() {
  const auth = JSON.parse(localStorage.getItem("auth"));
  return auth?.refresh;
}

function setUserData(data) {
  localStorage.setItem(
    "auth",
    JSON.stringify({
      access: data.access,
      refresh: data.refresh,
      user: data.user,
    })
  );
}

// ✅ Hook for login/register/logout actions
function useUserActions() {
  const navigate = useNavigate();

  function login(data) {
    return axios.post(`${baseURL}/auth/login/`, data).then((res) => {
      setUserData(res.data);
      navigate("/"); // redirect to home
    });
  }

  function register(data) {
    return axios.post(`${baseURL}/auth/register/`, data).then((res) => {
      setUserData(res.data);
      navigate("/"); // redirect to home
    });
  }

  function logout() {
    localStorage.removeItem("auth");
    navigate("/login");
  }

  return { login, register, logout };
}

// ✅ SWR-powered hook to fetch current user
function useUser() {
  const fetcher = async (url) => {
    const token = getAccessToken();
    if (!token) throw new Error("No access token found");

    const res = await axios.get(baseURL + url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  };

  const { data, error, mutate } = useSWR("/auth/me/", fetcher);

  return {
    user: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

export {
  useUserActions,
  getUser,
  getAccessToken,
  getRefreshToken,
  useUser,
};