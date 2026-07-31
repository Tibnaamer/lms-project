import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import useSWR from "swr";
import authSlice from "../store/slices/auth";
import { fetcher } from "../utils/axios";
import { AccountResponse } from "../types";
import { RootState } from "../store";
import PageHeader from "../components/PageHeader";

// Dashboard page component that displays user information and navigation links based on their role.
const Dashboard = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const account = useSelector((state: RootState) => state.auth.account);
  const userId = account?.id;

  // Fetch user data using SWR and update the Redux store on success
  const { data: user } = useSWR<AccountResponse | null>(
    userId ? `/user/${userId}/` : null,
    fetcher,
    {
      onSuccess: (freshUser) => {
        if (freshUser) {
          dispatch(authSlice.actions.setAccount(freshUser));
        }
      },
    },
  );

  // Handle user logout by dispatching the logout action and redirecting to the login page
  const handleLogout = () => {
    dispatch(authSlice.actions.setLogout());
    history.push("/login");
  };

  const role = user?.role || account?.role || "student";

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-6 shadow">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <PageHeader title="LMS Dashboard" role={role} />
            <p className="text-sm text-slate-600">
              {user ? `Welcome ${user.username}` : "Loading user..."}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded bg-red-600 px-4 py-2 text-white"
          >
            Logout
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Link to="/courses" className="rounded border bg-slate-100 p-4">
            Browse Courses
          </Link>
          {role === "student" && (
            <Link to="/my-courses" className="rounded border bg-slate-100 p-4">
              My Enrollments
            </Link>
          )}
          {(role === "teacher" || role === "admin") && (
            <Link
              to="/teacher/courses"
              className="rounded border bg-slate-100 p-4"
            >
              Manage Courses
            </Link>
          )}
          {role === "admin" && (
            <Link to="/admin/users" className="rounded border bg-slate-100 p-4">
              Manage Users
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
