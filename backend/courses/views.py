from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Course
from .serializers import CourseSerializer
from  django.shortcuts import render 
from rest_framework import viewsets

class CourseViewSet(viewsets.ViewSet):
    def list(self,request):
        courses=Course.objects.all()
        serializer=CourseSerializer(courses,many=True)
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None):
        id=pk
        if id is not None:
            course=Course.objects.get(id=id)
            serializer=CourseSerializer(course)
            return  Response(serializer.data)
    
    def create(self,request):
        serializer=CourseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'msg':'Data  created'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors , status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request,pk):
        id=pk
        course=Course.objects.get(pk=id)
        course.delete()
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