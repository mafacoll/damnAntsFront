import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
});

API.interceptors.request.use((config) => {
  const user = localStorage.getItem("user");

  if (user) {
    config.headers["X-User"] = user;
  }

  return config;
});

export default API;