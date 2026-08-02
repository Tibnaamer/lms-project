from rest_framework.permissions import BasePermission, SAFE_METHODS
from .models import UserProfile

# Function used to get the role of a user depending on their UserProfile.
def get_user_role(user):
    if not user or not getattr(user, 'is_authenticated', False):
        return None

    if getattr(user, 'is_superuser', False) or getattr(user, 'is_staff', False):
        return 'admin'

    try:
        return user.userprofile.role
    except UserProfile.DoesNotExist:
        return 'student'

# Sets custom permission classes for different user roles as well as object-level permissions.
class IsTeacherOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return get_user_role(request.user) in {'teacher', 'admin'}

class IsAdminRole(BasePermission):
    def has_permission(self, request, view):
        return get_user_role(request.user) == 'admin'

class IsCourseOwnerOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        user_role = get_user_role(request.user)
        if user_role == 'admin':
            return True

        if user_role == 'teacher' and getattr(obj, 'author', None) == request.user.username:
            return True

        return False