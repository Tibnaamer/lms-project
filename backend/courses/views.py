from django.shortcuts import get_object_or_404

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Course, Enrollment
from .permissions import IsCourseOwnerOrAdmin, IsTeacherOrAdmin, get_user_role
from .serializers import CourseSerializer, EnrollmentSerializer

# ViewSet for managing courses and enrollments and handling permissions based on user roles
class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all().order_by("-date_created")
    serializer_class = CourseSerializer

    def get_permissions(self):
        if self.action in {"list", "retrieve", "my_enrollments"}:
            permission_classes = [IsAuthenticated]
        elif self.action == "create":
            permission_classes = [IsAuthenticated, IsTeacherOrAdmin]
        elif self.action in {"update", "partial_update", "destroy", "enrollments"}:
            permission_classes = [IsAuthenticated, IsCourseOwnerOrAdmin]
        else:
            permission_classes = [IsAuthenticated]

        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user.username)

    def perform_update(self, serializer):
        serializer.save(author=serializer.instance.author)

    @action(detail=False, methods=["get"], url_path="my-enrollments")
    def my_enrollments(self, request):
        enrollments = Enrollment.objects.filter(student=request.user).select_related("course", "student")
        serializer = EnrollmentSerializer(enrollments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get", "post"], url_path="enrollments")
    def enrollments(self, request, pk=None):
        course = self.get_object()

        if request.method == "GET":
            if get_user_role(request.user) not in {"teacher", "admin"} and course.author != request.user.username:
                return Response({"detail": "Not permitted to view course enrollments."}, status=status.HTTP_403_FORBIDDEN)

            enrollments = Enrollment.objects.filter(course=course).select_related("course", "student")
            serializer = EnrollmentSerializer(enrollments, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        if get_user_role(request.user) != "student" and not request.user.is_superuser:
            return Response({"detail": "Only students can enroll in courses."}, status=status.HTTP_403_FORBIDDEN)

        enrollment, created = Enrollment.objects.get_or_create(student=request.user, course=course)
        if not created:
            return Response({"detail": "You are already enrolled in this course."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = EnrollmentSerializer(enrollment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)