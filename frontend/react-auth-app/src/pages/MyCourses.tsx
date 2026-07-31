import React from "react";
import useSWR from "swr";
import { EnrollmentResponse } from "../types";
import { fetcher } from "../utils/axios";
import PageHeader from "../components/PageHeader";
import StatusBanner from "../components/StatusBanner";

// MyCourses page component that displays the courses the user is currently enrolled in.
const MyCourses = () => {
  const { data, error } = useSWR<EnrollmentResponse[]>(
    "/courses/my-enrollments/",
    fetcher,
  );

  // Render the component, including the list of enrolled courses and their enrollment dates.
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-6 shadow">
        <PageHeader
          title="My Enrolled Courses"
          backTo="/"
          backLabel="Back to Dashboard"
        />

        {error && (
          <StatusBanner message="Failed to load enrollments." tone="error" />
        )}
        {!data && !error && <p>Loading enrollments...</p>}

        {data && data.length === 0 && (
          <p className="text-slate-600">
            You are not enrolled in any course yet.
          </p>
        )}

        <div className="space-y-3">
          {data?.map((row) => (
            <div key={row.id} className="rounded border p-4">
              <p className="font-medium">{row.course_title}</p>
              <p className="text-xs text-slate-500">
                Enrolled: {new Date(row.date_enrolled).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyCourses;
