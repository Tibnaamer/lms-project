import React from "react";
import useSWR from "swr";
import { EnrollmentResponse } from "../types";
import { fetcher } from "../utils/axios";
import PageHeader from "../components/PageHeader";
import StatusBanner from "../components/StatusBanner";

// A my courses page component that shows a list of courses the user is enrolled in, as well as their enrollment dates.
const MyCourses = () => {
  const { data, error } = useSWR<EnrollmentResponse[]>(
    "/courses/my-enrollments/",
    fetcher,
  );

  // Renders the my courses page, which includes a list of enrolled courses and their enrollment dates.
  return (
    <div className="min-h-screen bg-[#6ea89e] px-4 py-8 md:px-8 md:py-12">
      <div className="mx-auto max-w-4xl rounded-xl bg-white px-6 py-8 shadow-[0_12px_30px_rgba(0,0,0,0.12)] md:px-8 md:py-10">
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
            <div
              key={row.id}
              className="rounded-md border border-slate-200 bg-slate-50 p-4"
            >
              <p className="font-medium text-slate-900">{row.course_title}</p>
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
