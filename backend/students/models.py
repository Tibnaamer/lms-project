from django.conf import settings
from django.db import models
from courses.models import Course


class Student(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}".strip()


class StudentProfile(models.Model):
    ROLE_CHOICES = [
        ("student", "Student"),
        ("teacher", "Teacher"),
        ("admin", "Admin"),
    ]

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="student_profile")
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="student")

    def __str__(self):
        return f"{self.user.username} ({self.role})"


class Enrollment(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="student_enrollments")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="student_enrollments")
    date_enrolled = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("student", "course")

    def __str__(self):
        return f"{self.student} -> {self.course}"
