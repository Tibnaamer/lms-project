from django.contrib import admin
from .models import Student, StudentProfile, Enrollment

admin.site.register(Student)
admin.site.register(StudentProfile)
admin.site.register(Enrollment)