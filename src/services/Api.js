import cookieCutter from "cookie-cutter";
import axios from "axios";
import { message, Modal } from "antd";
const BASE = process.env.REACT_APP_LIVE_URL;
const api = axios.create({
  baseURL: BASE,
  withCredentials: true,
  headers: {
    Accept: "*/*",
    "Content-Type": "application/json",
    "x-auth-token": cookieCutter.get("csrftoken"), // Custom header included here
  },
});
api.interceptors.request.use((config) => {
  const authToken = localStorage.getItem("AUTH_TOKEN");
  if (authToken) {
    config.headers["Authorization"] = `Bearer ${authToken}`; // Use Authorization header
  }
  return config;
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      message.error("Session Expired");
      Modal.confirm({
        title: "Session Expired",
        content: `Your session has expired. Please log in again to continue.`,
        onOk() {
          message.success("Redirecting to login page");
          // Clear session storage and local storage
          localStorage.removeItem("AUTH_TOKEN");
          sessionStorage.clear();
          localStorage.clear();
          window.location.href = "/login";
        },
      });

      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);
export default function API(route, method, body) {
  return api({
    method: method,
    url: route,
    responseType: "json",
    data: body,
  })
    .then((res) => ({
      status: "success",
      data: res.data,
    }))
    .catch((err) => ({
      status: "fail",
      data: err.response?.data || err.message,
      errorCode: err.status,
    }));
}
export const LoginApi = (data) => {
  return axios.post(BASE + "/login/", data);
};

export const API_URL = BASE + "/";
export const MEDIA_URL = BASE + "/media/images/";
export const AVATAR_URL = BASE + "/media/avatars/";
