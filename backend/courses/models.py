from django.conf import settings
from django.db import models
from .user.models import User

# The Course model represents a course in the system and has fields for the title, description, author, and date created.
class Course(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(max_length=600)
    author = models.CharField(max_length=50)
    date_created = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.title

# The UserProfile model extends the custom User model to include fields for a role field, which might be a student, teacher, or admin.
class UserProfile(models.Model):
    ROLE_CHOICES = [
        ("student", "Student"),
        ("teacher", "Teacher"),
        ("admin", "Admin"),
    ]

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="student")

    def __str__(self):
        return f"{self.user.username} ({self.role})"

# The Enrollment model represents the enrollment of a student into a course and has foreign keys.
class Enrollment(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="enrollments")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="enrollments")
    date_enrolled = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("student", "course")

    def __str__(self):
        return f"{self.student} -> {self.course}"
