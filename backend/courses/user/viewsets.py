from courses.user.serializers import (
    UserSerializer,
    UserAdminUpdateSerializer,
    UserAdminCreateSerializer,
)
from courses.user.models import User
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework import filters
from rest_framework.exceptions import NotFound
from courses.permissions import IsAdminRole, get_user_role

# A viewset is a class-based view, able to handle all of the basic HTTP requests: GET, POST, PUT, DELETE.
class UserViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'patch', 'post']
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['id', 'username']
    ordering = ['-id']

# get_permissions method is used to determine the permissions required for each action in the viewset.
    def get_permissions(self):
        if self.action in {'partial_update', 'create'}:
            permission_classes = [IsAuthenticated, IsAdminRole]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
# get_serializer_class method is used to determine which serializer class to use based on the current action.
    def get_serializer_class(self):
        if self.action == 'create':
            return UserAdminCreateSerializer
        if self.action == 'partial_update':
            return UserAdminUpdateSerializer
        return UserSerializer

# get_queryset method is used to retrieve the queryset of users based on the current user's permissions.
    def get_queryset(self):
        if get_user_role(self.request.user) == 'admin':
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
