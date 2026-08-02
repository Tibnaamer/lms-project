import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import StatusBanner from "../components/StatusBanner";
import { authApi } from "../utils/api";

const getErrorMessage = (err: any): string => {
  const data = err?.response?.data;
  const status = err?.response?.status;

  if (!status && typeof err?.message === "string") {
    if (err.message.toLowerCase().includes("network error")) {
      return "Cannot reach backend API. Make sure Django is running on http://127.0.0.1:8000.";
    }
  }

  if (!data) {
    return "Could not create account.";
  }

  if (typeof data.detail === "string") {
    return data.detail;
  }

  if (typeof data === "string") {
    if (data.toLowerCase().includes("<!doctype html")) {
      return "Signup API endpoint not found. Check REACT_APP_API_URL.";
    }
    return data;
  }

  if (Array.isArray(data) && data.length > 0) {
    return String(data[0]);
  }

  if (typeof data === "object") {
    const firstKey = Object.keys(data)[0];
    const firstValue = firstKey ? data[firstKey] : null;
    if (Array.isArray(firstValue) && firstValue.length > 0) {
      return String(firstValue[0]);
    }
    if (typeof firstValue === "string") {
      return firstValue;
    }
  }

  return "Could not create account.";
};

// A sign up page component allowing users to create a new account by providing a username, email, and password. It also deals with form submission, validation, 
// and displays messages depending on the success/failure of the account creation process.
const Signup = () => {
  const history = useHistory();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().trim().required("Username is required"),
      email: Yup.string()
        .trim()
        .email("Invalid email")
        .required("Email is required"),
      password: Yup.string()
        .min(8, "At least 8 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setMessage("");

      try {
        await authApi.register(values);
        setMessage("Account created. You can now sign in.");
        history.push("/login");
      } catch (err: any) {
        setMessage(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    },
  });

  // Renders the sign up form, including input fields for username, email, password, submit button and a link to the login page for current users.
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#6ea89e] px-4 py-8 md:px-8 md:py-12">
      <div className="absolute right-0 top-1/2 hidden h-[68vh] w-[34vw] max-w-[420px] -translate-y-1/2 bg-cover bg-center lg:block" />

      <div className="relative w-full max-w-[640px] bg-white px-6 py-8 shadow-[0_12px_30px_rgba(0,0,0,0.12)] md:px-10 md:py-12">
        <h1 className="mb-8 text-4xl font-bold tracking-tight text-slate-900 md:mb-10 md:text-6xl">
          Sign Up
        </h1>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-xl font-semibold text-slate-700 md:text-3xl"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter your username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="h-12 w-full rounded-md border border-slate-200 bg-slate-100 px-4 text-base text-slate-900 shadow-sm outline-none transition focus:border-[#39a99d] md:h-14 md:text-lg"
            />
            {formik.touched.username && formik.errors.username && (
              <p className="mt-1 text-xs text-red-600">
                {formik.errors.username}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-xl font-semibold text-slate-700 md:text-3xl"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="h-12 w-full rounded-md border border-slate-200 bg-slate-100 px-4 text-base text-slate-900 shadow-sm outline-none transition focus:border-[#39a99d] md:h-14 md:text-lg"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="mt-1 text-xs text-red-600">{formik.errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-xl font-semibold text-slate-700 md:text-3xl"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="h-12 w-full rounded-md border border-slate-200 bg-slate-100 px-4 text-base text-slate-900 shadow-sm outline-none transition focus:border-[#39a99d] md:h-14 md:text-lg"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="mt-1 text-xs text-red-600">
                {formik.errors.password}
              </p>
            )}
          </div>

          <StatusBanner
            message={message}
            tone={message.includes("created") ? "success" : "error"}
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-4 h-14 w-full rounded-md bg-[#39a99d] text-xl font-medium uppercase tracking-wide text-white transition hover:brightness-95 disabled:opacity-70 md:h-16 md:text-3xl"
          >
            {loading ? "Creating..." : "Submit"}
          </button>
        </form>

        <p className="mt-12 text-2xl font-normal text-slate-900 md:mt-16 md:text-4xl">
          Or, Sign In{" "}
          <Link to="/login" className="font-medium text-[#2f2fa2] underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
