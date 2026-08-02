import React from "react";
import { Link } from "react-router-dom";
import { UserRole } from "../types";

type PageHeaderProps = {
  title: string;
  role?: UserRole;
  backTo?: string;
  backLabel?: string;
};

// Defines different styles depending on a user role.
const roleStyles: Record<UserRole, string> = {
  student: "bg-[#dff4ef] text-[#21665f]",
  teacher: "bg-[#f8edcf] text-[#815f1b]",
  admin: "bg-[#f7d7dd] text-[#8e2b40]",
};

// A page header component that sets the title of the page, displays the user's role as a badge, as well as provides a back link if specified.
const PageHeader = ({ title, role, backTo, backLabel }: PageHeaderProps) => {
  const badgeClassName = role
    ? roleStyles[role as UserRole] || "bg-slate-100 text-slate-700"
    : "";

  return (
    <div className="mb-6 flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          {title}
        </h1>
        {role && (
          <span
            aria-label={`User role: ${role}`}
            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${badgeClassName}`}
          >
            {role}
          </span>
        )}
      </div>

      {backTo && (
        <Link
          to={backTo}
          className="text-sm font-medium text-[#2f2fa2] underline"
        >
          {backLabel || "Back"}
        </Link>
      )}
    </div>
  );
};

export default PageHeader;
