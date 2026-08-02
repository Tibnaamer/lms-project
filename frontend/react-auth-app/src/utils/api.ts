import axios from "axios";

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  username: string;
  email: string;
  password: string;
};

// Sets API utility for authentication related requests, which includes login and registration.
const defaultApiUrl =
  process.env.NODE_ENV === "test" ? "" : "http://127.0.0.1:8000/api";
const apiUrl = (process.env.REACT_APP_API_URL || defaultApiUrl).replace(
  /\/+$/,
  "",
);

export const authApi = {
  login: (payload: LoginPayload) =>
    axios.post(`${apiUrl}/auth/login/`, payload),
  register: (payload: RegisterPayload) =>
    axios.post(`${apiUrl}/auth/register/`, payload),
};
