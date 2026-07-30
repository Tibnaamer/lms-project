import React, { FormEvent, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import useSWR from "swr";
import { RootState } from "../store";
import { CourseResponse, EnrollmentResponse } from "../types";
import axiosService, { fetcher } from "../utils/axios";

// TeacherCourses component that allows teachers to manage their courses, including creating and deleting courses.
const TeacherCourses = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);
  const [enrollmentsByCourse, setEnrollmentsByCourse] = useState<Record<number, EnrollmentResponse[]>>({});
  const [loadingEnrollmentsFor, setLoadingEnrollmentsFor] = useState<number | null>(null);

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

  // Start editing a course by setting the editing state and pre-filling the form with the course's current data.
  const startEditing = (course: CourseResponse) => {
    setEditingCourseId(course.id);
    setTitle(course.title);
    setDescription(course.description);
    setMessage("");
  };

  const cancelEditing = () => {
    setEditingCourseId(null);
    setTitle("");
    setDescription("");
    setMessage("");
  };

  const handleUpdate = async (event: FormEvent) => {
    event.preventDefault();

    if (!editingCourseId) {
      return;
    }

    try {
      await axiosService.put(`/courses/${editingCourseId}/`, {
        title,
        description,
      });
      setMessage("Course updated.");
      cancelEditing();
      mutate();
    } catch (err: any) {
      setMessage(err?.response?.data?.detail || "Failed to update course.");
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

  // Handle loading enrollments for a specific course by sending a GET request to the server and storing the results in state.
  const handleLoadEnrollments = async (courseId: number) => {
    try {
      setLoadingEnrollmentsFor(courseId);
      const response = await axiosService.get<EnrollmentResponse[]>(
        `/courses/${courseId}/enrollments/`,
      );
      setEnrollmentsByCourse((prev) => ({
        ...prev,
        [courseId]: response.data,
      }));
    } catch (err: any) {
      setMessage(err?.response?.data?.detail || "Failed to load enrollments.");
    } finally {
      setLoadingEnrollmentsFor(null);
    }
  };

  // Render the TeacherCourses component, including the course management form and the list of courses with options to edit, delete, and view enrollments.
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl rounded-xl bg-white p-6 shadow">
        <h1 className="mb-4 text-2xl font-semibold">
          Teacher Course Management
        </h1>
        {message && <p className="mb-3 text-sm text-blue-700">{message}</p>}

        <form
          onSubmit={editingCourseId ? handleUpdate : handleCreate}
          className="mb-6 grid gap-3 rounded border p-4"
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={editingCourseId ? "Edit course title" : "Course title"}
            className="rounded border p-2"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={editingCourseId ? "Edit course description" : "Course description"}
            className="rounded border p-2"
            rows={4}
            required
          />
          <div className="flex gap-2">
            <button
              className="w-fit rounded bg-emerald-700 px-4 py-2 text-white"
              type="submit"
            >
              {editingCourseId ? "Save Changes" : "Create Course"}
            </button>
            {editingCourseId && (
              <button
                className="w-fit rounded bg-slate-500 px-4 py-2 text-white"
                type="button"
                onClick={cancelEditing}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Render the list of courses with options to edit, delete, and view enrollments for each course. */}
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
              <div className="flex flex-col gap-2">
                <button
                  className="rounded bg-amber-600 px-3 py-2 text-sm text-white"
                  onClick={() => startEditing(course)}
                >
                  Edit
                </button>
                <button
                  className="rounded bg-red-700 px-3 py-2 text-sm text-white"
                  onClick={() => handleDelete(course.id)}
                >
                  Delete
                </button>
                <button
                  className="rounded bg-blue-700 px-3 py-2 text-sm text-white"
                  onClick={() => handleLoadEnrollments(course.id)}
                >
                  {loadingEnrollmentsFor === course.id
                    ? "Loading..."
                    : "View Enrollments"}
                </button>
              </div>
            </div>
            {enrollmentsByCourse[course.id] && (
              <div className="mt-2 rounded border border-dashed p-3">
                <p className="mb-2 text-sm font-medium">Enrolled Students</p>
                {enrollmentsByCourse[course.id].length === 0 ? (
                  <p className="text-sm text-slate-600">No students enrolled yet.</p>
                ) : (
                  <ul className="space-y-1 text-sm text-slate-700">
                    {enrollmentsByCourse[course.id].map((enrollment) => (
                      <li key={enrollment.id}>
                        {enrollment.student_username} - {new Date(enrollment.date_enrolled).toLocaleDateString()}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherCourses;
