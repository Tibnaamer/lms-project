import React, { FormEvent, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import useSWR from "swr";
import { RootState } from "../store";
import { CourseResponse } from "../types";
import axiosService, { fetcher } from "../utils/axios";

// TeacherCourses component that allows teachers to manage their courses, including creating and deleting courses.
const TeacherCourses = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const account = useSelector((state: RootState) => state.auth.account);
  const isAdmin = account?.role === "admin";

  const {
    data: courses,
    mutate,
    error,
  } = useSWR<CourseResponse[]>("/courses/", fetcher);

  // Filter courses based on the user's role. Admins see all courses/teachers only see their own courses.
  const visibleCourses = useMemo(() => {
    if (!courses) {
      return [];
    }
    if (isAdmin) {
      return courses;
    }
    return courses.filter((c) => c.author === account?.username);
  }, [courses, isAdmin, account?.username]);

  // Handle course creation by sending a POST request to the server and updating the course list on success.
  const handleCreate = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");

    try {
      await axiosService.post("/courses/", { title, description });
      setTitle("");
      setDescription("");
      setMessage("Course created.");
      mutate();
    } catch (err: any) {
      setMessage(err?.response?.data?.detail || "Failed to create course.");
    }
  };

  // Handle course deletion by sending a DELETE request to the server and updating the course list on success.
  const handleDelete = async (id: number) => {
    try {
      await axiosService.delete(`/courses/${id}/`);
      setMessage("Course deleted.");
      mutate();
    } catch (err: any) {
      setMessage(err?.response?.data?.detail || "Failed to delete course.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl rounded-xl bg-white p-6 shadow">
        <h1 className="mb-4 text-2xl font-semibold">
          Teacher Course Management
        </h1>
        {message && <p className="mb-3 text-sm text-blue-700">{message}</p>}

        <form
          onSubmit={handleCreate}
          className="mb-6 grid gap-3 rounded border p-4"
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Course title"
            className="rounded border p-2"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Course description"
            className="rounded border p-2"
            rows={4}
            required
          />
          <button
            className="w-fit rounded bg-emerald-700 px-4 py-2 text-white"
            type="submit"
          >
            Create Course
          </button>
        </form>

        {error && <p className="text-red-600">Failed to load courses.</p>}
        {!courses && !error && <p>Loading courses...</p>}

        <div className="space-y-3">
          {visibleCourses.map((course) => (
            <div
              key={course.id}
              className="flex items-start justify-between rounded border p-4"
            >
              <div>
                <p className="font-medium">{course.title}</p>
                <p className="text-sm text-slate-700">{course.description}</p>
                <p className="text-xs text-slate-500">
                  Author: {course.author}
                </p>
              </div>
              <button
                className="rounded bg-red-700 px-3 py-2 text-sm text-white"
                onClick={() => handleDelete(course.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherCourses;
