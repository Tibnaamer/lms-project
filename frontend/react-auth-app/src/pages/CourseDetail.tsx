import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import useSWR from "swr";
import { RootState } from "../store";
import { CourseResponse } from "../types";
import axiosService, { fetcher } from "../utils/axios";
import PageHeader from "../components/PageHeader";
import StatusBanner from "../components/StatusBanner";

type RouteParams = {
  id: string;
};

// A course detail page component that displays detailed information about a specific course, as well as that it also allows students to enroll in the course.
const CourseDetail = () => {
  const { id } = useParams<RouteParams>();
  const account = useSelector((state: RootState) => state.auth.account);
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState<"success" | "error" | "info">("info");

  const { data: course, error } = useSWR<CourseResponse>(
    `/courses/${id}/`,
    fetcher,
  );

  const canEnroll = (account?.role || "student") === "student";

  const handleEnroll = async () => {
    try {
      await axiosService.post(`/courses/${id}/enrollments/`);
      setMessage("Enrolled successfully.");
      setTone("success");
    } catch (err: any) {
      setMessage(
        err?.response?.data?.detail || "Could not enroll in this course.",
      );
      setTone("error");
    }
  };

  return (
    <div className="min-h-screen bg-[#6ea89e] px-4 py-8 md:px-8 md:py-12">
      <div className="mx-auto max-w-4xl rounded-xl bg-white px-6 py-8 shadow-[0_12px_30px_rgba(0,0,0,0.12)] md:px-8 md:py-10">
        <PageHeader
          title="Course Details"
          role={account?.role || "student"}
          backTo="/courses"
          backLabel="Back to Courses"
        />

        <StatusBanner message={message} tone={tone} />
        {error && (
          <StatusBanner message="Failed to load this course." tone="error" />
        )}

        {!course && !error && <p>Loading course...</p>}

        {course && (
          <div className="space-y-3 rounded-md border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-2xl font-semibold text-slate-900">
              {course.title}
            </h2>
            <p className="text-slate-700">{course.description}</p>
            <p className="text-sm text-slate-500">Teacher: {course.author}</p>

            {canEnroll && (
              <button
                onClick={handleEnroll}
                className="rounded-md bg-[#39a99d] px-3 py-2 text-sm font-medium text-white transition hover:brightness-95"
              >
                Enroll in this course
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
