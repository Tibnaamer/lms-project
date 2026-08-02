from rest_framework import status
from rest_framework import viewsets
from rest_framework.response import Response

from django.shortcuts import get_object_or_404
from .models import Student
from .serializers import StudentSerializer

# This student view set is for managing students, which enables the use of CRUD operations on students.
class StudentViewSet(viewsets.ViewSet):
    def list(self,request):
        students=Student.objects.all()
        serializer=StudentSerializer(students,many=True)
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None):
        student = get_object_or_404(Student, pk=pk)
        serializer = StudentSerializer(student)
        return Response(serializer.data)
    
    def create(self,request):
        serializer=StudentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'msg':'Data  created'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors , status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request,pk):
        student = get_object_or_404(Student, pk=pk)
        student.delete()
        return Response({'msg':'Data Deleted'})
