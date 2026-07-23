from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import Course, UserProfile, Enrollment


class CoursesSmokeTests(TestCase):
	def setUp(self):
		self.User = get_user_model()

	def test_models_create(self):
		user = self.User.objects.create_user(username='u1', password='p')
		profile = UserProfile.objects.create(user=user, role='student')
		course = Course.objects.create(name='Sample', description='Desc')
		Enrollment.objects.create(student=user, course=course)
		self.assertTrue(Course.objects.exists())
		self.assertTrue(Enrollment.objects.exists())
