import React from "react";

// The StatusBanner component displays a message with a specific tone (info, success, or error) and is used to provide feedback to the user.
type StatusBannerProps = {
  message: string;
  tone?: "info" | "success" | "error";
};

// Define CSS classes for different message tones
const toneClass: Record<NonNullable<StatusBannerProps["tone"]>, string> = {
  info: "border border-slate-200 bg-slate-100 text-slate-700",
  success: "border border-emerald-200 bg-emerald-100 text-emerald-800",
  error: "border border-red-200 bg-red-100 text-red-700",
};

// A status banner component that displays messages with a specific tone (info, success/error).
const StatusBanner = ({ message, tone = "info" }: StatusBannerProps) => {
  if (!message) {
    return null;
  }

  const liveRegionRole = tone === "error" ? "alert" : "status";
  const liveRegionPoliteness = tone === "error" ? "assertive" : "polite";

  return (
    <p
      role={liveRegionRole}
      aria-live={liveRegionPoliteness}
      className={`mb-4 rounded-md px-4 py-3 text-sm font-medium ${toneClass[tone]}`}
    >
      {message}
    </p>
  );
};

export default StatusBanner;
