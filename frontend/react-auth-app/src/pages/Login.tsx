import React, { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import authSlice from "../store/slices/auth";
import StatusBanner from "../components/StatusBanner";
import { authApi } from "../utils/api";

// is a login component allowing users to log in by providing their email/password. It also deals with form submission, validation.
function Login() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();

  const handleLogin = (email: string, password: string) => {
    authApi
      .login({ email, password })
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

  // Formik is used to manage the form state, handle validation, as well as submit the login form.
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
      email: Yup.string().trim().required("Email is required"),
      password: Yup.string().trim().required("Password is required"),
    }),
  });

  // Renders the login form, which includes input fields for email/password, a submit button, and a link to the signup page for new users.
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#6ea89e] px-4 py-8 md:px-8 md:py-12">
      <div className="absolute right-0 top-1/2 hidden h-[68vh] w-[34vw] max-w-[420px] -translate-y-1/2 bg-cover bg-center lg:block" />

      <div className="relative w-full max-w-[640px] bg-white px-6 py-8 shadow-[0_12px_30px_rgba(0,0,0,0.12)] md:px-10 md:py-12">
        <h1 className="mb-2 text-4xl font-bold tracking-tight text-slate-900 md:text-6xl">
          Login
        </h1>
        <p className="mb-8 text-base text-slate-600 md:mb-10 md:text-xl">
          Log in to your account
        </p>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-xl font-semibold text-slate-700 md:text-3xl"
            >
              Email
            </label>
            <input
              className="h-12 w-full rounded-md border border-slate-200 bg-slate-100 px-4 text-base text-slate-900 shadow-sm outline-none transition focus:border-[#39a99d] md:h-14 md:text-lg"
              id="email"
              type="email"
              placeholder="Enter your email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email ? (
              <p className="mt-1 text-xs text-red-600">{formik.errors.email}</p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-xl font-semibold text-slate-700 md:text-3xl"
            >
              Password
            </label>
            <input
              className="h-12 w-full rounded-md border border-slate-200 bg-slate-100 px-4 text-base text-slate-900 shadow-sm outline-none transition focus:border-[#39a99d] md:h-14 md:text-lg"
              id="password"
              type="password"
              placeholder="Enter your password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password ? (
              <p className="mt-1 text-xs text-red-600">
                {formik.errors.password}
              </p>
            ) : null}
          </div>

          <StatusBanner message={message} tone="error" />

          <button
            type="submit"
            disabled={loading}
            className="mt-4 h-14 w-full rounded-md bg-[#39a99d] text-xl font-medium uppercase tracking-wide text-white transition hover:brightness-95 disabled:opacity-70 md:h-16 md:text-3xl"
          >
            {loading ? "Signing In..." : "Submit"}
          </button>

          <p className="pt-5 text-2xl font-normal text-slate-900 md:pt-6 md:text-4xl">
            New here?{" "}
            <Link to="/signup" className="font-medium text-[#2f2fa2] underline">
              Create account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
