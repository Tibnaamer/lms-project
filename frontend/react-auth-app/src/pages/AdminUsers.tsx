import React, { useState } from "react";
import { useSelector } from "react-redux";
import useSWR from "swr";
import { AccountResponse } from "../types";
import { fetcher } from "../utils/axios";
import PageHeader from "../components/PageHeader";
import StatusBanner from "../components/StatusBanner";
import axiosService from "../utils/axios";
import { RootState } from "../store";

// An admin users page component that allows admin users to manage user accounts, create teacher accounts, toggle user status, as well as change user roles.
const AdminUsers = () => {
  const { data, error, mutate } = useSWR<AccountResponse[]>("/user/", fetcher);
  const account = useSelector((state: RootState) => state.auth.account);
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState<"info" | "success" | "error">("info");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [creatingTeacher, setCreatingTeacher] = useState(false);
  const [teacherForm, setTeacherForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  // Handles input changes for the teacher creation form and updates the corresponding field in the state.
  const handleTeacherInputChange =
    (field: "username" | "email" | "password") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setTeacherForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleCreateTeacher = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");

    try {
      setCreatingTeacher(true);
      await axiosService.post("/user/", {
        ...teacherForm,
        role: "teacher",
      });
      setMessage("Teacher account created.");
      setTone("success");
      setTeacherForm({ username: "", email: "", password: "" });
      mutate();
    } catch (err: any) {
      setMessage(err?.response?.data?.detail || "Failed to create teacher.");
      setTone("error");
    } finally {
      setCreatingTeacher(false);
    }
  };

  const handleToggleStatus = async (user: AccountResponse) => {
    try {
      setUpdatingUserId(user.id);
      await axiosService.patch(`/user/${user.id}/`, {
        is_active: !user.is_active,
      });
      setMessage(
        `${user.username} is now ${user.is_active ? "inactive" : "active"}.`,
      );
      setTone("success");
      mutate();
    } catch (err: any) {
      setMessage(err?.response?.data?.detail || "Failed to update user.");
      setTone("error");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleToggleRole = async (user: AccountResponse) => {
    const nextRole = user.role === "teacher" ? "student" : "teacher";

    try {
      setUpdatingUserId(user.id);
      await axiosService.patch(`/user/${user.id}/`, {
        role: nextRole,
      });
      setMessage(`${user.username} role updated to ${nextRole}.`);
      setTone("success");
      mutate();
    } catch (err: any) {
      setMessage(err?.response?.data?.detail || "Failed to update role.");
      setTone("error");
    } finally {
      setUpdatingUserId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#6ea89e] px-4 py-8 md:px-8 md:py-12">
      <div className="mx-auto max-w-4xl rounded-xl bg-white px-6 py-8 shadow-[0_12px_30px_rgba(0,0,0,0.12)] md:px-8 md:py-10">
        <PageHeader
          title="Admin: Users"
          role="admin"
          backTo="/"
          backLabel="Back to Dashboard"
        />

        <p className="mb-4 text-sm text-slate-600">
          This view lists users returned by the current backend permissions.
        </p>
        <StatusBanner message={message} tone={tone} />

        <form
          onSubmit={handleCreateTeacher}
          className="mb-6 grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-4"
        >
          <p className="text-sm font-semibold text-slate-800">
            Create Teacher Account
          </p>
          <input
            value={teacherForm.username}
            onChange={handleTeacherInputChange("username")}
            placeholder="Teacher username"
            className="rounded-md border border-slate-200 bg-white p-2"
            required
          />
          <input
            value={teacherForm.email}
            onChange={handleTeacherInputChange("email")}
            type="email"
            placeholder="Teacher email"
            className="rounded-md border border-slate-200 bg-white p-2"
            required
          />
          <input
            value={teacherForm.password}
            onChange={handleTeacherInputChange("password")}
            type="password"
            placeholder="Temporary password"
            className="rounded-md border border-slate-200 bg-white p-2"
            minLength={8}
            required
          />
          <button
            type="submit"
            disabled={creatingTeacher}
            className="w-fit rounded-md bg-[#39a99d] px-4 py-2 text-sm font-medium text-white transition hover:brightness-95 disabled:opacity-70"
          >
            {creatingTeacher ? "Creating..." : "Create Teacher"}
          </button>
        </form>

        {error && <StatusBanner message="Failed to load users." tone="error" />}
        {!data && !error && <p>Loading users...</p>}

        <div className="space-y-3">
          {data?.map((user) => (
            <div
              key={user.id}
              className="rounded-md border border-slate-200 bg-slate-50 p-4"
            >
              <p className="font-medium text-slate-900">{user.username}</p>
              <p className="text-sm text-slate-700">{user.email}</p>
              <p className="text-xs text-slate-500">
                Role: {user.role || "student"}
              </p>
              <p className="text-xs text-slate-500">
                Status: {user.is_active ? "Active" : "Inactive"}
              </p>
              <button
                className="mt-3 rounded-md bg-[#2f2fa2] px-3 py-2 text-sm font-medium text-white transition hover:brightness-95 disabled:opacity-70"
                onClick={() => handleToggleStatus(user)}
                disabled={updatingUserId === user.id}
              >
                {updatingUserId === user.id
                  ? "Updating..."
                  : user.is_active
                    ? "Deactivate"
                    : "Activate"}
              </button>
              {user.id !== account?.id && user.role !== "admin" && (
                <button
                  className="mt-2 rounded-md bg-[#39a99d] px-3 py-2 text-sm font-medium text-white transition hover:brightness-95 disabled:opacity-70"
                  onClick={() => handleToggleRole(user)}
                  disabled={updatingUserId === user.id}
                >
                  {updatingUserId === user.id
                    ? "Updating..."
                    : user.role === "teacher"
                      ? "Set as Student"
                      : "Set as Teacher"}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
