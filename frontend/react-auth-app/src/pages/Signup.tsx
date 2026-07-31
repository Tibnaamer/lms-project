import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import StatusBanner from "../components/StatusBanner";
import { authApi } from "../utils/api";

// Signup component that allows users to create a new account by providing a username, email, and password.
// It deals with form submission, validation, and displays messages based on the success/failure of the account creation process.
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
        setMessage(err?.response?.data?.detail || "Could not create account.");
      } finally {
        setLoading(false);
      }
    },
  });

  // Render the Signup component, including the form for username, email, and password, as well as validation messages and a link to the login page.
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow">
        <h1 className="mb-4 text-2xl font-semibold">Create Account</h1>

        <form onSubmit={formik.handleSubmit} className="space-y-3">
          <div>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded border p-2"
            />
            {formik.touched.username && formik.errors.username && (
              <p className="mt-1 text-xs text-red-600">
                {formik.errors.username}
              </p>
            )}
          </div>

          <div>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded border p-2"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="mt-1 text-xs text-red-600">{formik.errors.email}</p>
            )}
          </div>

          <div>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded border p-2"
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
            className="w-full rounded bg-emerald-700 px-4 py-2 text-white"
          >
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-700">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-700">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
