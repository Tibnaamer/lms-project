import React from "react";
import useSWR from "swr";

import { AccountResponse } from "../types";
import { fetcher } from "../utils/axios";

// AdminUsers component that displays a list of users for admin management.
const AdminUsers = () => {
  const { data, error } = useSWR<AccountResponse[]>("/user/", fetcher);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-6 shadow">
        <h1 className="mb-4 text-2xl font-semibold">Admin: Users</h1>

        <p className="mb-4 text-sm text-slate-600">
          This view lists users returned by the current backend permissions.
        </p>

        {error && <p className="text-red-600">Failed to load users.</p>}
        {!data && !error && <p>Loading users...</p>}

        <div className="space-y-3">
          {data?.map((user) => (
            <div key={user.id} className="rounded border p-4">
              <p className="font-medium">{user.username}</p>
              <p className="text-sm text-slate-700">{user.email}</p>
              <p className="text-xs text-slate-500">
                Role: {user.role || "student"}
              </p>
              <p className="text-xs text-slate-500">
                Status: {user.is_active ? "Active" : "Inactive"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
