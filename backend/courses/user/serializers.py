from courses.user.models import User
from courses.permissions import get_user_role
from rest_framework import serializers

# Serializer for user data
class UserSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()

    def get_role(self, obj):
        return get_user_role(obj)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_active', 'role']
        read_only_fields = ['is_active', 'role']
