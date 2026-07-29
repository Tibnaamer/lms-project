from courses.user.serializers import UserSerializer
from courses.user.models import User
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework import filters
from rest_framework.exceptions import NotFound

# A viewset is a class-based view, able to handle all of the basic HTTP requests: GET, POST, PUT, DELETE.
class UserViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['id', 'username']
    ordering = ['-id']

# get_queryset method is used to retrieve the queryset of users based on the current user's permissions.
    def get_queryset(self):
        if self.request.user.is_superuser:
            return User.objects.all()
        return User.objects.filter(pk=self.request.user.pk)
    
# get_object method is used to retrieve a specific user object based on the provided lookup field.
    def get_object(self):
        lookup_field_value = self.kwargs.get(self.lookup_field, self.request.user.pk)

        try:
            obj = self.get_queryset().get(pk=lookup_field_value)
        except User.DoesNotExist:
            raise NotFound()

        self.check_object_permissions(self.request, obj)

        return obj
