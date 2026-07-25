from courses.user.serializers import UserSerializer
from courses.user.models import User
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework import filters

# A viewset is a class-based view, able to handle all of the basic HTTP requests: GET, POST, PUT, DELETE 
# without hard coding any of the logic
class UserViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['id', 'username']
    ordering = ['-id']

    def get_queryset(self):
        if self.request.user.is_superuser:
            return User.objects.all()
        return User.objects.filter(pk=self.request.user.pk)

    def get_object(self):
        lookup_field_value = self.kwargs.get(self.lookup_field, self.request.user.pk)

        obj = User.objects.get(pk=lookup_field_value)
        self.check_object_permissions(self.request, obj)

        return obj
