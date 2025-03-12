/* global localStorage */
const axios = require("axios");

function getHeaders() {
  return { "Content-Type": "application/json" };
}

function getTimezoneOffset() {
  const offsetMinutes = new Date().getTimezoneOffset();
  const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
  const offsetMinutesFormatted = Math.abs(offsetMinutes) % 60;
  return (offsetMinutes < 0 ? "+" : "-") + ("0" + offsetHours).slice(-2) + ":" + ("0" + offsetMinutesFormatted).slice(-2);
}
const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const showLoader = config.showLoader !== false;
  config = {
    ...config,
    headers: { ...config.headers, timezoneOffset: getTimezoneOffset() },
  };
  if (showLoader) {
    document.getElementById("loader").style.display = "block";
  }
  if (!token) {
    return config;
  }
  config = {
    ...config,
    headers: { ...config.headers, Authorization: `Bearer ${token}` },
  };
  return config;
});

instance.interceptors.response.use(
  function (response) {
    const showLoader = response.config.showLoader !== false;
    if (showLoader) {
      document.getElementById("loader").style.display = "none";
    }
    return response;
  },
  function (error) {
    const { status } = error?.response;
    document.getElementById("loader").style.display = "none";
    if (status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("uniqueId");
      window.location = "/signIn";
    } else if (status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("uniqueId");
      window.location = "/signIn";
    } else if (status === 409) {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("uniqueId");
      window.location = "/signIn";
    }
    return Promise.reject(error);
  }
);

function apiGet(url, params = {}, showLoader = true) {
  return instance.get(url, { params, showLoader });
}

function apiPost(url, body) {
  return instance.post(url, body);
}

function apiPut(url, body) {
  return instance.put(url, body);
}

function apiDelete(url, body) {
  return instance.delete(url, { params: body });
}

export { getHeaders, apiGet, apiPost, apiPut, apiDelete };
