import React from "react";

// StatusBanner is used to show status messages to the user.
type StatusBannerProps = {
  message: string;
  tone?: "info" | "success" | "error";
};

// Define CSS classes for different message tones
const toneClass: Record<NonNullable<StatusBannerProps["tone"]>, string> = {
  info: "bg-slate-100 text-slate-700",
  success: "bg-emerald-100 text-emerald-800",
  error: "bg-red-100 text-red-700",
};

// StatusBanner component displays a message with a specific tone (info, success, or error).
const StatusBanner = ({ message, tone = "info" }: StatusBannerProps) => {
  if (!message) {
    return null;
  }

  return (
    <p className={`mb-3 rounded px-3 py-2 text-sm ${toneClass[tone]}`}>
      {message}
    </p>
  );
};

export default StatusBanner;
