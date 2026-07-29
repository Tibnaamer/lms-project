from rest_framework import serializers
from .models import Course, Enrollment, UserProfile

# Serializer for Course model
class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ["id", "title", "description", "author", "date_created"]
        read_only_fields = ["author", "date_created"]

# Serializer for UserProfile model
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ["role"]

# Serializer for Enrollment model
class EnrollmentSerializer(serializers.ModelSerializer):
    student_username = serializers.CharField(source="student.username", read_only=True)
    course_title = serializers.CharField(source="course.title", read_only=True)

    class Meta:
        model = Enrollment
        fields = ["id", "student", "student_username", "course", "course_title", "date_enrolled"]
        read_only_fields = ["id", "student", "student_username", "course_title", "date_enrolled"]

    def create(self, validated_data):
        request = self.context["request"]
        return Enrollment.objects.create(student=request.user, **validated_data)