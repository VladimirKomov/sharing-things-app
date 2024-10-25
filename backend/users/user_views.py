from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from users.user_mapper import map_request_to_user_registration, map_api_error_as_resp, map_to_api_response_as_resp, \
    map_request_to_request
from .user_serializers import RegistrationSerializer, LoginSerializer


class UserRegistrationView(APIView):
    def post(self, request):
        request_api = map_request_to_user_registration(request)
        # user into serializer
        serializer = RegistrationSerializer(
            data=request_api['data']
        )
        if serializer.is_valid():
            serializer.save()
            # if OK
            return (map_to_api_response_as_resp(
                serializer.data,
                message="User created successfully",
                code=status.HTTP_201_CREATED))

        # if errors
        return map_api_error_as_resp('Validation error', status.HTTP_400_BAD_REQUEST, serializer.errors)


class LoginView(APIView):
    def post(self, request):
        request_api = map_request_to_request(request)
        serializer = LoginSerializer(data=request_api["data"])
        if serializer.is_valid():
            usernameOrEmail = serializer.validated_data['usernameOrEmail']
            password = serializer.validated_data['password']
            user = authenticate(request_api, usernameOrEmail=usernameOrEmail, password=password)

            if user is not None:
                refresh = RefreshToken.for_user(user)
                return map_to_api_response_as_resp(
                    {
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                    },
                    message="Login successful",
                    code=status.HTTP_200_OK)

            return map_api_error_as_resp('Invalid credentials', status.HTTP_400_BAD_REQUEST)

        return map_api_error_as_resp('Validation error', status.HTTP_400_BAD_REQUEST, serializer.errors)


class UserLogoutView(APIView):
    def post(self, request):
        try:
            request_token = request.data['refresh_token']
            token = RefreshToken(request_token)
            token.blacklist()
            return map_to_api_response_as_resp(message="Logout successful", code=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return map_api_error_as_resp('Logout failed', status.HTTP_400_BAD_REQUEST)
