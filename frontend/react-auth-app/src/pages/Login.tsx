import React, { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useHistory } from "react-router-dom";
import authSlice from "../store/slices/auth";

// is the login page component for the react authentication app, the component manages the login state, handles form submission,
function Login() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();

  const apiUrl = process.env.REACT_APP_API_URL || "";

  const handleLogin = (email: string, password: string) => {
    axios
      .post(`${apiUrl}/auth/login/`, { email, password })
      .then((res) => {
        dispatch(
          authSlice.actions.setAuthTokens({
            token: res.data.access,
            refreshToken: res.data.refresh,
          }),
        );
        dispatch(authSlice.actions.setAccount(res.data.user));
        setLoading(false);
        history.push("/");
      })
      .catch((err) => {
        setLoading(false);
        setMessage(err?.response?.data?.detail?.toString() || "Login failed");
      });
  };

  // formik is used to manage the form state and validation
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      setLoading(true);
      await handleLogin(values.email, values.password);
    },
    validationSchema: Yup.object({
      email: Yup.string().trim().required("Le nom d'utilisateur est requis"),
      password: Yup.string().trim().required("Le mot de passe est requis"),
    }),
  });

  return (
    <div className="h-screen flex bg-gray-bg1">
      <div className="w-full max-w-md m-auto bg-white rounded-lg border border-primaryBorder shadow-default py-10 px-16">
        <h1 className="text-2xl font-medium text-primary mt-4 mb-12 text-center">
          Log in to your account 🔐
        </h1>
        <form onSubmit={formik.handleSubmit}>
          <div className="space-y-4">
            <input
              className="border-b border-gray-300 w-full px-2 h-8 rounded focus:border-blue-500"
              id="email"
              type="email"
              placeholder="Email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.email ? <div>{formik.errors.email} </div> : null}
            <input
              className="border-b border-gray-300 w-full px-2 h-8 rounded focus:border-blue-500"
              id="password"
              type="password"
              placeholder="Password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.password ? (
              <div>{formik.errors.password} </div>
            ) : null}
          </div>
          <div className="text-danger text-center my-2" hidden={false}>
            {message}
          </div>

          <div className="flex justify-center items-center mt-6">
            <button
              type="submit"
              disabled={loading}
              className="rounded border-gray-300 p-2 w-32 bg-blue-700 text-white"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
