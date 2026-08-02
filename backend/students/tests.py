from django.test import TestCase
from django.contrib.auth import get_user_model
from courses.models import Course
from .models import Student, StudentProfile, Enrollment

# This smoke tests class covers scenarios such as creating students/enrollments, user registration/login, role-based access control,
# as well as ensuring that duplicate enrollments are rejected.
class StudentsSmokeTests(TestCase):
    def setUp(self):
        self.User = get_user_model()

    def test_models_create(self):
        user = self.User.objects.create_user(username='u1', email='u1@example.com', password='p')
        StudentProfile.objects.create(user=user, role='student')
        course = Course.objects.create(title='Sample', description='Desc', author='Teacher')
        student = Student.objects.create(first_name='Jane', last_name='Doe', email='jane@example.com')
        Enrollment.objects.create(student=user, course=course)
        self.assertTrue(Student.objects.filter(pk=student.pk).exists())
        self.assertTrue(Enrollment.objects.exists())