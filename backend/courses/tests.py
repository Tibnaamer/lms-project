from django.contrib.auth import get_user_model
from django.db import IntegrityError
from django.test import TestCase
from rest_framework.test import APIClient
from .models import Course, Enrollment, UserProfile

# The CoursesSmokeTests class test cases cover scenarios such as creating courses and enrollments, user registration and login, role-based access control, 
# as well as ensuring that duplicate enrollments are rejected.
class CoursesSmokeTests(TestCase):
    def setUp(self):
        self.User = get_user_model()
        self.client = APIClient()

    def test_models_create(self):
        user = self.User.objects.create_user(
            username="u1",
            email="u1@example.com",
            password="p",
        )
        UserProfile.objects.create(user=user, role="student")
        course = Course.objects.create(
            title="Sample",
            description="Desc",
            author="test",
        )
        enrollment = Enrollment.objects.create(student=user, course=course)

        self.assertTrue(Course.objects.filter(pk=course.pk).exists())
        self.assertTrue(Enrollment.objects.filter(pk=enrollment.pk).exists())

    def test_user_profile_role_is_stored(self):
        user = self.User.objects.create_user(
            username="u2",
            email="u2@example.com",
            password="p",
        )
        profile = UserProfile.objects.create(user=user, role="teacher")

        self.assertEqual(profile.role, "teacher")
        self.assertEqual(profile.user.username, "u2")

    def test_user_profile_defaults_to_student_role(self):
        user = self.User.objects.create_user(
            username="u4",
            email="u4@example.com",
            password="p",
        )
        profile = UserProfile.objects.create(user=user)

        self.assertEqual(profile.role, "student")

    def test_courses_list_requires_authentication(self):
        Course.objects.create(title="Intro", description="Desc", author="test")

        response = self.client.get("/api/courses/")

        self.assertEqual(response.status_code, 401)

    def test_login_returns_tokens_for_valid_credentials(self):
        self.User.objects.create_user(
            username="loginuser",
            email="login@example.com",
            password="secret123",
        )

        response = self.client.post(
            "/api/auth/login/",
            {"email": "login@example.com", "password": "secret123"},
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertIn("access", response.json())
        self.assertIn("refresh", response.json())
        self.assertEqual(response.json()["user"]["username"], "loginuser")

    def test_registration_creates_user_and_returns_payload(self):
        response = self.client.post(
            "/api/auth/register/",
            {
                "username": "newuser",
                "email": "newuser@example.com",
                "password": "strongpass123",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()["user"]["username"], "newuser")
        self.assertTrue(self.User.objects.filter(username="newuser").exists())

    def test_admin_role_can_list_all_users(self):
        admin_user = self.User.objects.create_user(
            username="admin1",
            email="admin1@example.com",
            password="p",
        )
        UserProfile.objects.create(user=admin_user, role="admin")
        self.User.objects.create_user(
            username="student2",
            email="student2@example.com",
            password="p",
        )

        self.client.force_authenticate(user=admin_user)
        response = self.client.get("/api/user/")

        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.json()), 2)

    def test_admin_role_can_toggle_user_active_status(self):
        admin_user = self.User.objects.create_user(
            username="admin2",
            email="admin2@example.com",
            password="p",
        )
        target_user = self.User.objects.create_user(
            username="student3",
            email="student3@example.com",
            password="p",
        )
        UserProfile.objects.create(user=admin_user, role="admin")

        self.client.force_authenticate(user=admin_user)
        response = self.client.patch(
            f"/api/user/{target_user.pk}/",
            {"is_active": False},
            format="json",
        )

        target_user.refresh_from_db()
        self.assertEqual(response.status_code, 200)
        self.assertFalse(target_user.is_active)
        
# Test cases for the Courses app to ensure that admin users can assign roles and create users with specific roles.
    def test_admin_role_can_assign_teacher_role(self):
        admin_user = self.User.objects.create_user(
            username="admin3",
            email="admin3@example.com",
            password="p",
        )
        target_user = self.User.objects.create_user(
            username="student6",
            email="student6@example.com",
            password="p",
        )
        UserProfile.objects.create(user=admin_user, role="admin")

        self.client.force_authenticate(user=admin_user)
        response = self.client.patch(
            f"/api/user/{target_user.pk}/",
            {"role": "teacher"},
            format="json",
        )

        target_profile = UserProfile.objects.get(user=target_user)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(target_profile.role, "teacher")

    def test_admin_role_can_create_teacher_user(self):
        admin_user = self.User.objects.create_user(
            username="admin4",
            email="admin4@example.com",
            password="p",
        )
        UserProfile.objects.create(user=admin_user, role="admin")

        self.client.force_authenticate(user=admin_user)
        response = self.client.post(
            "/api/user/",
            {
                "username": "teacher_new",
                "email": "teacher_new@example.com",
                "password": "strongpass123",
                "role": "teacher",
            },
            format="json",
        )

        created_user = self.User.objects.get(username="teacher_new")
        created_profile = UserProfile.objects.get(user=created_user)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(created_profile.role, "teacher")

    def test_non_admin_cannot_toggle_user_active_status(self):
        regular_user = self.User.objects.create_user(
            username="student4",
            email="student4@example.com",
            password="p",
        )
        target_user = self.User.objects.create_user(
            username="student5",
            email="student5@example.com",
            password="p",
        )

        self.client.force_authenticate(user=regular_user)
        response = self.client.patch(
            f"/api/user/{target_user.pk}/",
            {"is_active": False},
            format="json",
        )

        target_user.refresh_from_db()
        self.assertEqual(response.status_code, 403)
        self.assertTrue(target_user.is_active)

    def test_duplicate_enrollment_is_rejected(self):
        user = self.User.objects.create_user(
            username="u3",
            email="u3@example.com",
            password="p",
        )
        course = Course.objects.create(title="Dup", description="Desc", author="test")

        Enrollment.objects.create(student=user, course=course)

        with self.assertRaises(IntegrityError):
            Enrollment.objects.create(student=user, course=course)

    def test_teacher_can_delete_existing_course(self):
        teacher_user = self.User.objects.create_user(
            username="teacher_manage",
            email="teacher_manage@example.com",
            password="p",
        )
        UserProfile.objects.create(user=teacher_user, role="teacher")
        course = Course.objects.create(title="Manage Me", description="Desc", author="another")

        self.client.force_authenticate(user=teacher_user)
        response = self.client.delete(f"/api/courses/{course.pk}/")

        self.assertEqual(response.status_code, 204)
        self.assertFalse(Course.objects.filter(pk=course.pk).exists())

    def test_student_can_enroll_through_course_enrollments_endpoint(self):
        student_user = self.User.objects.create_user(
            username="student_enroll",
            email="student_enroll@example.com",
            password="p",
        )
        UserProfile.objects.create(user=student_user, role="student")
        course = Course.objects.create(title="Enroll Me", description="Desc", author="teacher")

        self.client.force_authenticate(user=student_user)
        response = self.client.post(f"/api/courses/{course.pk}/enrollments/")

        self.assertEqual(response.status_code, 201)
        self.assertTrue(
            Enrollment.objects.filter(student=student_user, course=course).exists()
        )
