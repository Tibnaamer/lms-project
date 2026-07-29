from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Student, StudentProfile, Enrollment
from .serializers import StudentSerializer
from  django.shortcuts import render 
from rest_framework import viewsets

class StudentViewSet(viewsets.ViewSet):
    def list(self,request):
        students=Student.objects.all()
        serializer=StudentSerializer(students,many=True)
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None):
        id=pk
        if id is not None:
            student=Student.objects.get(id=id)
            serializer=StudentSerializer(student)
            return  Response(serializer.data)
    
    def create(self,request):
        serializer=StudentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'msg':'Data  created'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors , status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request,pk):
        id=pk
        student=Student.objects.get(pk=id)
        student.delete()
        return Response({'msg':'Data Deleted'})

# class CourseView(APIView):
#     def get(self, request):
#         courses = Course.objects.all()
#         serializer = CourseSerializer(courses, many=True)
#         return Response(serializer.data)

#     def post(self, request):
#         serializer = CourseSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)