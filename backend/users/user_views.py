from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from users.user_mapper import map_request_to_user_registration
from .user_serializers import RegistrationSerializer, LoginSerializer
from common.responses import APIResponse
from common.errors import APIError


class UserRegistrationView(APIView):
    def post(self, request):
        # user into serializer
        serializer = RegistrationSerializer(
            data=map_request_to_user_registration(request.data)
        )
        if serializer.is_valid():
            serializer.save()
            # if OK
            return (APIResponse(
                serializer.data,
                message="User created successfully",
                code=status.HTTP_201_CREATED).as_response())

        # if errors
        return APIError('Validation error', status.HTTP_400_BAD_REQUEST, serializer.errors).as_response()


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            usernameOrEmail = serializer.validated_data['usernameOrEmail']
            password = serializer.validated_data['password']
            user = authenticate(request, usernameOrEmail=usernameOrEmail, password=password)

            if user is not None:
                refresh = RefreshToken.for_user(user)
                return APIResponse(
                    {
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                    },
                    message="Login successful",
                    code=status.HTTP_200_OK).as_response()

            return APIError('Invalid credentials', status.HTTP_400_BAD_REQUEST).as_response()

        return APIError('Validation error', status.HTTP_400_BAD_REQUEST, serializer.errors).as_response()


class UserLogoutView(APIView):
    def post(self, request):
        try:
            request_token = request.data['refresh_token']
            token = RefreshToken(request_token)
            token.blacklist()
            return APIResponse(message="Logout successful", code=status.HTTP_205_RESET_CONTENT).as_response()
        except Exception as e:
            return APIError('Logout failed', status.HTTP_400_BAD_REQUEST).as_response()
