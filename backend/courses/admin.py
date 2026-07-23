from django.contrib import admin
from .models import Course, UserProfile, Enrollment

admin.site.register(Course)
admin.site.register(UserProfile)
admin.site.register(Enrollment)
