import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import useSWR from "swr";
import authSlice from "../store/slices/auth";
import { fetcher } from "../utils/axios";
import { AccountResponse } from "../types";
import { RootState } from "../store";
import PageHeader from "../components/PageHeader";

// A dashboard component that serves as the main landing page for users that are logged in and displays navigation options depending on a user's role.
const Dashboard = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const account = useSelector((state: RootState) => state.auth.account);
  const userId = account?.id;

  // Collects the user's profile data through the use of SWR and updates the Redux store with the latest account information upon successful retrieval.
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

  // Handles the logout functionality by sending out the setLogout action and redirecting the user to the login page.
  const handleLogout = () => {
    dispatch(authSlice.actions.setLogout());
    history.push("/login");
  };

  const role = user?.role || account?.role || "student";

  return (
    <div className="min-h-screen bg-[#6ea89e] px-4 py-8 md:px-8 md:py-12">
      <div className="mx-auto max-w-5xl rounded-xl bg-white px-6 py-8 shadow-[0_12px_30px_rgba(0,0,0,0.12)] md:px-8 md:py-10">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="w-full">
            <PageHeader title="LMS Dashboard" role={role} />
            <p className="-mt-2 text-sm text-slate-600">
              {user ? `Welcome ${user.username}` : "Loading user..."}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-md bg-[#b23b3b] px-4 py-2 text-sm font-medium text-white transition hover:brightness-95"
          >
            Logout
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            to="/courses"
            className="rounded-md border border-slate-200 bg-slate-100 p-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-200"
          >
            Browse Courses
          </Link>
          {role === "student" && (
            <Link
              to="/my-courses"
              className="rounded-md border border-slate-200 bg-slate-100 p-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-200"
            >
              My Enrollments
            </Link>
          )}
          {(role === "teacher" || role === "admin") && (
            <Link
              to="/teacher/courses"
              className="rounded-md border border-slate-200 bg-slate-100 p-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-200"
            >
              Manage Courses
            </Link>
          )}
          {role === "admin" && (
            <Link
              to="/admin/users"
              className="rounded-md border border-slate-200 bg-slate-100 p-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-200"
            >
              Manage Users
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
