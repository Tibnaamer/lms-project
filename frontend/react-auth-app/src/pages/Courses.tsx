import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import useSWR from "swr";
import { RootState } from "../store";
import { CourseResponse } from "../types";
import axiosService, { fetcher } from "../utils/axios";
import PageHeader from "../components/PageHeader";
import StatusBanner from "../components/StatusBanner";

// A courses page component that displays a list of available courses and allows students to enroll on them.
const Courses = () => {
  const [message, setMessage] = useState<string>("");
  const [messageTone, setMessageTone] = useState<"success" | "error" | "info">(
    "info",
  );
  const account = useSelector((state: RootState) => state.auth.account);

  const {
    data: courses,
    mutate,
    error,
  } = useSWR<CourseResponse[]>("/courses/", fetcher);

  // Determines if a user can enroll on a course based on their role (for example students can enroll, but teachers cannot).
  const canEnroll = (account?.role || "student") === "student";

  const handleEnroll = async (courseId: number) => {
    try {
      await axiosService.post(`/courses/${courseId}/enrollments/`);
      setMessage("Enrolled successfully.");
      setMessageTone("success");
      mutate();
    } catch (err: any) {
      setMessage(err?.response?.data?.detail || "Could not enroll in course.");
      setMessageTone("error");
    }
  };

  // Renders the courses page, including the list of available courses and an enroll button for the students.
  return (
    <div className="min-h-screen bg-[#6ea89e] px-4 py-8 md:px-8 md:py-12">
      <div className="mx-auto max-w-5xl rounded-xl bg-white px-6 py-8 shadow-[0_12px_30px_rgba(0,0,0,0.12)] md:px-8 md:py-10">
        <PageHeader
          title="Available Courses"
          role={account?.role || "student"}
          backTo="/"
          backLabel="Back to Dashboard"
        />
        <StatusBanner message={message} tone={messageTone} />
        {error && (
          <StatusBanner message="Failed to load courses." tone="error" />
        )}
        {!courses && !error && <p>Loading courses...</p>}

        <div className="grid gap-4 sm:grid-cols-2">
          {courses?.map((course) => (
            <div
              key={course.id}
              className="rounded-md border border-slate-200 bg-slate-50 p-4"
            >
              <h2 className="text-xl font-semibold text-slate-900">
                {course.title}
              </h2>
              <p className="mb-2 text-sm text-slate-700">
                {course.description}
              </p>
              <p className="mb-3 text-xs text-slate-500">
                Teacher: {course.author}
              </p>

              <div className="mb-3">
                <Link
                  to={`/courses/${course.id}`}
                  className="text-sm font-medium text-[#2f2fa2] underline"
                >
                  View details
                </Link>
              </div>

              {canEnroll && (
                <button
                  onClick={() => handleEnroll(course.id)}
                  className="rounded-md bg-[#39a99d] px-3 py-2 text-sm font-medium text-white transition hover:brightness-95"
                >
                  Enroll
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;