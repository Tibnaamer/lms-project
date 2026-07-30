import React, { useState } from "react";
import { useSelector } from "react-redux";
import useSWR from "swr";
import { RootState } from "../store";
import { CourseResponse } from "../types";
import axiosService, { fetcher } from "../utils/axios";

// Courses page component that displays available courses and allows students to enroll.
const Courses = () => {
  const [message, setMessage] = useState<string>("");
  const account = useSelector((state: RootState) => state.auth.account);

  const {
    data: courses,
    mutate,
    error,
  } = useSWR<CourseResponse[]>("/courses/", fetcher);

  // Determine if the user can enroll in courses based on their role
  const canEnroll = (account?.role || "student") === "student";

  const handleEnroll = async (courseId: number) => {
    try {
      await axiosService.post(`/courses/${courseId}/enrollments/`);
      setMessage("Enrolled successfully.");
      mutate();
    } catch (err: any) {
      setMessage(err?.response?.data?.detail || "Could not enroll in course.");
    }
  };

  // Render the Courses component, including the list of available courses and an enroll button for students.
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl rounded-xl bg-white p-6 shadow">
        <h1 className="mb-4 text-2xl font-semibold">Available Courses</h1>
        {message && <p className="mb-3 text-sm text-blue-700">{message}</p>}
        {error && <p className="text-red-600">Failed to load courses.</p>}
        {!courses && !error && <p>Loading courses...</p>}

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Render each course with an enroll button if the user can enroll. */}
          {courses?.map((course) => (
            <div key={course.id} className="rounded border p-4">
              <h2 className="text-lg font-semibold">{course.title}</h2>
              <p className="mb-2 text-sm text-slate-700">
                {course.description}
              </p>
              <p className="mb-3 text-xs text-slate-500">
                Teacher: {course.author}
              </p>

              {canEnroll && (
                <button
                  onClick={() => handleEnroll(course.id)}
                  className="rounded bg-blue-700 px-3 py-2 text-sm text-white"
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
