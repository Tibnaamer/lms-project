from django.contrib.auth import get_user_model
from django.db import IntegrityError
from django.test import TestCase
from rest_framework.test import APIClient

from .models import Course, Enrollment, UserProfile

# Test cases for the Courses app to ensure that models are created and user profiles store roles correctly.
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
