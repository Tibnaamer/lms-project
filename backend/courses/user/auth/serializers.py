from rest_framework import serializers
from courses.user.serializers import UserSerializer
from courses.user.models import User

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        identifier = (attrs.get('email') or '').strip()
        password = attrs.get('password')

        user = User.objects.filter(email__iexact=identifier).first()
        if user is None:
            user = User.objects.filter(username__iexact=identifier).first()

        if user is None:
            raise serializers.ValidationError('Invalid credentials')

        if not user.check_password(password):
            raise serializers.ValidationError('Invalid credentials')

        if not user.is_active:
            raise serializers.ValidationError('Invalid credentials')

        return {'user': user}

class RegisterSerializer(UserSerializer):
    password = serializers.CharField(max_length=128, min_length=8, write_only=True, required=True)
    email = serializers.EmailField(required=True, write_only=True, max_length=128)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'is_active', 'role']
        read_only_fields = ['is_active', 'role']

    def create(self, validated_data):
        if User.objects.filter(email=validated_data['email']).exists():
            raise serializers.ValidationError({'email': 'An account with this email already exists.'})

        return User.objects.create_user(**validated_data)