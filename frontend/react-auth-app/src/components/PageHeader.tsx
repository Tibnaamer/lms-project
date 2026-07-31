import React from "react";
import { Link } from "react-router-dom";
import { UserRole } from "../types";

type PageHeaderProps = {
  title: string;
  role?: UserRole;
  backTo?: string;
  backLabel?: string;
};

// Defines styles for different user roles
const roleStyles: Record<UserRole, string> = {
  student: "bg-sky-100 text-sky-800",
  teacher: "bg-amber-100 text-amber-800",
  admin: "bg-rose-100 text-rose-800",
};

// PageHeader component sets the title of the page, displays the user's role as a badge, and provides a back link if specified.
const PageHeader = ({ title, role, backTo, backLabel }: PageHeaderProps) => {
  const badgeClassName = role
    ? roleStyles[role as UserRole] || "bg-slate-100 text-slate-700"
    : "";

  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-semibold">{title}</h1>
        {role && (
          <span
            aria-label={`User role: ${role}`}
            className={`rounded-full px-2 py-1 text-xs font-medium ${badgeClassName}`}
          >
            {role}
          </span>
        )}
      </div>

      {backTo && (
        <Link to={backTo} className="text-sm text-blue-700">
          {backLabel || "Back"}
        </Link>
      )}
    </div>
  );
};

export default PageHeader;