import React, { FormEvent, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import useSWR from "swr";
import { RootState } from "../store";
import { CourseResponse, EnrollmentResponse } from "../types";
import axiosService, { fetcher } from "../utils/axios";
import PageHeader from "../components/PageHeader";
import StatusBanner from "../components/StatusBanner";

// A teacher courses page component that enables teachers to manage courses, which includes creating, editing, deleting courses, as well as viewing currently enrolled students.
const TeacherCourses = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"success" | "error" | "info">(
    "info",
  );
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);
  const [enrollmentsByCourse, setEnrollmentsByCourse] = useState<
    Record<number, EnrollmentResponse[]>
  >({});
  const [loadingEnrollmentsFor, setLoadingEnrollmentsFor] = useState<
    number | null
  >(null);

  const account = useSelector((state: RootState) => state.auth.account);
  const isAdmin = account?.role === "admin";

  const {
    data: courses,
    mutate,
    error,
  } = useSWR<CourseResponse[]>("/courses/", fetcher);

  // Allows for the filtering of the list of courses based on the user's role, allowing admins/teachers to see all courses, students can only see their own courses.
  const visibleCourses = useMemo(() => {
    if (!courses) {
      return [];
    }
    if (isAdmin || account?.role === "teacher") {
      return courses;
    }
    return courses.filter((c) => c.author === account?.username);
  }, [courses, isAdmin, account?.role, account?.username]);

  // Handle course creation by sending a POST request to the server and updating the course list on success.
  const handleCreate = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");

    try {
      await axiosService.post("/courses/", { title, description });
      setTitle("");
      setDescription("");
      setMessage("Course created.");
      setMessageTone("success");
      mutate();
    } catch (err: any) {
      setMessage(err?.response?.data?.detail || "Failed to create course.");
      setMessageTone("error");
    }
  };

  // Handles course editing by sending a PUT request to the server and updating the course list on success.
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
      setMessageTone("success");
      cancelEditing();
      mutate();
    } catch (err: any) {
      setMessage(err?.response?.data?.detail || "Failed to update course.");
      setMessageTone("error");
    }
  };

  // Handles course deletion by sending a DELETE request to the server and updating the course list on success.
  const handleDelete = async (id: number) => {
    try {
      await axiosService.delete(`/courses/${id}/`);
      setMessage("Course deleted.");
      setMessageTone("success");
      mutate();
    } catch (err: any) {
      setMessage(err?.response?.data?.detail || "Failed to delete course.");
      setMessageTone("error");
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
      setMessageTone("error");
    } finally {
      setLoadingEnrollmentsFor(null);
    }
  };

  // Renders the teacher courses page, including the form for creating/editing courses, the ability to edit, delete, and view enrollments for each course.
  return (
    <div className="min-h-screen bg-[#6ea89e] px-4 py-8 md:px-8 md:py-12">
      <div className="mx-auto max-w-5xl rounded-xl bg-white px-6 py-8 shadow-[0_12px_30px_rgba(0,0,0,0.12)] md:px-8 md:py-10">
        <PageHeader
          title="Teacher Course Management"
          role={account?.role || "teacher"}
          backTo="/"
          backLabel="Back to Dashboard"
        />
        <StatusBanner message={message} tone={messageTone} />

        <form
          onSubmit={editingCourseId ? handleUpdate : handleCreate}
          className="mb-6 grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-4"
        >
          <label
            htmlFor="teacher-course-title"
            className="text-sm font-medium text-slate-700"
          >
            Course title
          </label>
          <input
            id="teacher-course-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={editingCourseId ? "Edit course title" : "Course title"}
            className="rounded-md border border-slate-200 bg-white p-2"
            required
          />
          <label
            htmlFor="teacher-course-description"
            className="text-sm font-medium text-slate-700"
          >
            Course description
          </label>
          <textarea
            id="teacher-course-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={
              editingCourseId ? "Edit course description" : "Course description"
            }
            className="rounded-md border border-slate-200 bg-white p-2"
            rows={4}
            required
          />
          <div className="flex gap-2">
            <button
              className="w-fit rounded-md bg-[#39a99d] px-4 py-2 text-sm font-medium text-white transition hover:brightness-95"
              type="submit"
            >
              {editingCourseId ? "Save Changes" : "Create Course"}
            </button>
            {editingCourseId && (
              <button
                className="w-fit rounded-md bg-slate-500 px-4 py-2 text-sm font-medium text-white transition hover:brightness-95"
                type="button"
                onClick={cancelEditing}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Render the list of courses with options to edit, delete, and view enrollments for each course. */}
        {error && (
          <StatusBanner message="Failed to load courses." tone="error" />
        )}
        {!courses && !error && <p>Loading courses...</p>}

        <div className="space-y-3">
          {visibleCourses.map((course) => (
            <React.Fragment key={course.id}>
              <div className="flex items-start justify-between rounded-md border border-slate-200 bg-slate-50 p-4">
                <div>
                  <p className="font-medium text-slate-900">{course.title}</p>
                  <p className="text-sm text-slate-700">{course.description}</p>
                  <p className="text-xs text-slate-500">
                    Author: {course.author}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    className="rounded-md bg-amber-600 px-3 py-2 text-sm font-medium text-white transition hover:brightness-95"
                    onClick={() => startEditing(course)}
                  >
                    Edit
                  </button>
                  <button
                    className="rounded-md bg-[#b23b3b] px-3 py-2 text-sm font-medium text-white transition hover:brightness-95"
                    onClick={() => handleDelete(course.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="rounded-md bg-[#2f2fa2] px-3 py-2 text-sm font-medium text-white transition hover:brightness-95"
                    onClick={() => handleLoadEnrollments(course.id)}
                  >
                    {loadingEnrollmentsFor === course.id
                      ? "Loading..."
                      : "View Enrollments"}
                  </button>
                </div>
              </div>

              {enrollmentsByCourse[course.id] && (
                <div className="mt-2 rounded-md border border-dashed border-slate-300 bg-white p-3">
                  <p className="mb-2 text-sm font-medium">Enrolled Students</p>
                  {enrollmentsByCourse[course.id].length === 0 ? (
                    <p className="text-sm text-slate-600">
                      No students enrolled yet.
                    </p>
                  ) : (
                    <ul className="space-y-1 text-sm text-slate-700">
                      {enrollmentsByCourse[course.id].map((enrollment) => (
                        <li key={enrollment.id}>
                          {enrollment.student_username} -{" "}
                          {new Date(
                            enrollment.date_enrolled,
                          ).toLocaleDateString()}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherCourses;
