from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import Course, UserProfile, Enrollment


class CoursesSmokeTests(TestCase):
	def setUp(self):
		self.User = get_user_model()

	def test_models_create(self):
		user = self.User.objects.create_user(username='u1', email='u1@example.com', password='p')
		profile = UserProfile.objects.create(user=user, role='student')
		course = Course.objects.create(title='Sample', description='Desc', author='test')
		Enrollment.objects.create(student=user, course=course)
		self.assertTrue(Course.objects.exists())
		self.assertTrue(Enrollment.objects.exists())
