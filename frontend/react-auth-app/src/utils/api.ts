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

const apiUrl = process.env.REACT_APP_API_URL || "";

export const authApi = {
  login: (payload: LoginPayload) =>
    axios.post(`${apiUrl}/auth/login/`, payload),
  register: (payload: RegisterPayload) =>
    axios.post(`${apiUrl}/auth/register/`, payload),
};
