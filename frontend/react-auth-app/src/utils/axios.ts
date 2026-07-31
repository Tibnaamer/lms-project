import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import store from "../store";
import authSlice from "../store/slices/auth";

const defaultApiUrl =
  process.env.NODE_ENV === "test" ? "" : "http://127.0.0.1:8000/api";
const apiUrl = (process.env.REACT_APP_API_URL || defaultApiUrl).replace(
  /\/+$/,
  "",
);

const axiosService = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosService.interceptors.request.use(async (config) => {
  const { token } = store.getState().auth;

  if (token !== null) {
    config.headers.Authorization = "Bearer " + token;
    const requestUrl = (config.baseURL || "") + (config.url || "");
    // @ts-ignore
    console.debug("[Request]", requestUrl, JSON.stringify(token));
  }
  return config;
});

axiosService.interceptors.response.use(
  (res) => {
    const requestUrl = (res.config.baseURL || "") + (res.config.url || "");
    // @ts-ignore
    console.debug("[Response]", requestUrl, res.status, res.data);
    return Promise.resolve(res);
  },
  (err) => {
    const requestUrl = err?.config
      ? (err.config.baseURL || "") + (err.config.url || "")
      : "unknown-request";
    const status = err?.response?.status ?? "no-status";
    const data = err?.response?.data ?? err?.message ?? "unknown-error";
    console.debug("[Response]", requestUrl, status, data);
    return Promise.reject(err);
  },
);

// @ts-ignore
const refreshAuthLogic = async (failedRequest) => {
  const { refreshToken } = store.getState().auth;
  if (refreshToken !== null) {
    return axios
      .post(
        "/auth/refresh/",
        {
          refresh: refreshToken,
        },
        {
          baseURL: apiUrl,
        },
      )
      .then((resp) => {
        const { access, refresh } = resp.data;
        failedRequest.response.config.headers.Authorization =
          "Bearer " + access;
        store.dispatch(
          authSlice.actions.setAuthTokens({
            token: access,
            refreshToken: refresh,
          }),
        );
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          store.dispatch(authSlice.actions.setLogout());
        }
      });
  }
};

createAuthRefreshInterceptor(axiosService, refreshAuthLogic);

export function fetcher<T = any>(url: string) {
  return axiosService.get<T>(url).then((res) => res.data);
}

export default axiosService;
