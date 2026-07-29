export type UserRole = "student" | "teacher" | "admin";

export interface AccountResponse {
  id: string;
  email: string;
  username: string;
  is_active: boolean;
  role?: UserRole;
  created?: Date;
  updated?: Date;
}

export interface CourseResponse {
  id: number;
  title: string;
  description: string;
  author: string;
  date_created: string;
}

export interface EnrollmentResponse {
  id: number;
  student: number;
  student_username: string;
  course: number;
  course_title: string;
  date_enrolled: string;
}
