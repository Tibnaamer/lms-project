from urllib import request

from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from students.user.auth.serializers import LoginSerializer, RegisterSerializer
from students.user.serializers import UserSerializer

class LoginViewSet(viewsets.ViewSet):
    permission_classes = (AllowAny,)

    def create(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)

        return Response(
            {
                'user': UserSerializer(user).data,
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            },
            status=status.HTTP_200_OK,
        )


class RegistrationViewSet(viewsets.ViewSet):
    permission_classes = (AllowAny,)

    def create(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({'user': UserSerializer(user).data}, status=status.HTTP_201_CREATED)


class RefreshViewSet(viewsets.ViewSet):
    permission_classes = (AllowAny,)

    def create(self, request, *args, **kwargs):
        serializer = TokenRefreshSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)