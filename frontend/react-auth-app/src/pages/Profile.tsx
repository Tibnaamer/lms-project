import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import authSlice from "../store/slices/auth";
import useSWR from "swr";
import { fetcher } from "../utils/axios";
import { AccountResponse } from "../types";
import { RootState } from "../store";
import PageHeader from "../components/PageHeader";

// A profile page component that displays the user's profile information and allows users to log out.
const Profile = () => {
  const account = useSelector((state: RootState) => state.auth.account);
  const dispatch = useDispatch();
  const history = useHistory();

  const userId = account?.id;

  const { data: user } = useSWR<AccountResponse | null>(
    userId ? `/user/${userId}/` : null,
    fetcher,
  );

  // Handles the logout functionality by sending the setLogout action and redirecting the user to the login page.
  const handleLogout = () => {
    dispatch(authSlice.actions.setLogout());
    history.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#6ea89e] px-4 py-8 md:px-8 md:py-12">
      <div className="mx-auto max-w-4xl rounded-xl bg-white px-6 py-8 shadow-[0_12px_30px_rgba(0,0,0,0.12)] md:px-8 md:py-10">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="w-full">
            <PageHeader
              title="Profile"
              backTo="/"
              backLabel="Back to Dashboard"
            />
          </div>
          <button
            onClick={handleLogout}
            className="rounded-md bg-[#b23b3b] px-4 py-2 text-sm font-medium text-white transition hover:brightness-95"
          >
            Logout
          </button>
        </div>
        {user ? (
          <div className="rounded-md border border-slate-200 bg-slate-50 p-5">
            <p className="text-2xl font-semibold text-slate-900">
              Welcome, {user.username}
            </p>
            <p className="mt-2 text-sm text-slate-600">Email: {user.email}</p>
            <p className="text-sm text-slate-600">
              Status: {user.is_active ? "Active" : "Inactive"}
            </p>
          </div>
        ) : (
          <p className="mt-8 text-slate-700">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
