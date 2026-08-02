from courses.user.models import User
from courses.permissions import get_user_role
from rest_framework import serializers
from courses.models import UserProfile

class UserSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()

    def get_role(self, obj):
        return get_user_role(obj)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_active', 'role']
        read_only_fields = ['is_active', 'role']

class UserAdminUpdateSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(
        choices=["student", "teacher", "admin"],
        required=False,
    )

    class Meta:
        model = User
        fields = ['is_active', 'role']

    def update(self, instance, validated_data):
        role = validated_data.pop("role", None)
        instance = super().update(instance, validated_data)

        if role is not None:
            profile, _ = UserProfile.objects.get_or_create(user=instance)
            profile.role = role
            profile.save(update_fields=["role"])

        return instance

class UserAdminCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    role = serializers.ChoiceField(
        choices=["student", "teacher"],
        required=False,
        default="teacher",
    )
    is_active = serializers.BooleanField(read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "is_active", "role"]

    def create(self, validated_data):
        role = validated_data.pop("role", "teacher")
        password = validated_data.pop("password")
        user = User.objects.create_user(password=password, **validated_data)
        UserProfile.objects.update_or_create(user=user, defaults={"role": role})
        return user

    def to_representation(self, instance):
        return UserSerializer(instance).data
