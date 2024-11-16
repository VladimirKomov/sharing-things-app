from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView

from common.mapper import map_to_api_response_as_resp, map_api_error_as_resp, map_request_to_request
from dashboard.models import UserSettings
from users.serializers import RegistrationSerializer, LoginSerializer


class UserRegistrationView(APIView):
    # access is open
    permission_classes = [AllowAny]

    def post(self, request):
        # user into serializer
        data = request.data
        user_serializer = RegistrationSerializer(data=data)

        if user_serializer.is_valid():
            # Save user
            user = user_serializer.save()

            # create UserSettings
            UserSettings.objects.create(
                user=user,
                first_name=data.get('first_name', ''),
                last_name=data.get('last_name', ''),
                phone_number=data.get('phone_number', ''),
                address=data.get('address', ''),
                latitude=data.get('latitude'),
                longitude=data.get('longitude')
            )

            # if OK
            return map_to_api_response_as_resp(
                user_serializer.data,
                message="User created successfully",
                code=status.HTTP_201_CREATED
            )

        # if errors
        return map_api_error_as_resp('Validation error', status.HTTP_400_BAD_REQUEST, user_serializer.errors)


class LoginView(APIView):
    # access is open
    permission_classes = [AllowAny]

    def post(self, request):
        request_api = map_request_to_request(request)
        serializer = LoginSerializer(data=request_api["data"])
        if serializer.is_valid():
            usernameOrEmail = serializer.validated_data['usernameOrEmail']
            password = serializer.validated_data['password']
            user = authenticate(request_api, usernameOrEmail=usernameOrEmail, password=password)

            if user is not None:
                refresh = RefreshToken.for_user(user)
                user_id = user.id
                username = user.username

                # get user settings if exists
                latitude = None
                longitude = None
                if hasattr(user, 'settings') and user.settings:
                    latitude = user.settings.latitude
                    longitude = user.settings.longitude

                return map_to_api_response_as_resp(
                    {
                        'token': {
                            'access': str(refresh.access_token),
                            'refresh': str(refresh),
                        },
                        'user': {
                            'id': user_id,
                            'username': username,
                            'lat': latitude,
                            'lng': longitude
                        },
                    },
                    message="Login successful",
                    code=status.HTTP_200_OK)

            return map_api_error_as_resp('Invalid credentials', status.HTTP_400_BAD_REQUEST)

        return map_api_error_as_resp('Validation error', status.HTTP_400_BAD_REQUEST, serializer.errors)


class UserLogoutView(APIView):
    # access is open
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            request_token = request.data['refresh_token']
            token = RefreshToken(request_token)
            token.blacklist()
            return map_to_api_response_as_resp(message="Logout successful", code=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return map_api_error_as_resp('Logout failed', status.HTTP_400_BAD_REQUEST)


class CustomTokenVerifyView(TokenVerifyView):
    def post(self, request, *args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            request.data["token"] = token
        try:
            response = super().post(request, *args, **kwargs)
            if response.status_code == status.HTTP_200_OK:
                return map_to_api_response_as_resp(
                    response.data,
                    "Token is valid",
                    status.HTTP_200_OK
                )
            else:
                return map_api_error_as_resp(
                    'Invalid token',
                    response.status_code,
                    response.data
                )
        except InvalidToken as e:
            return map_api_error_as_resp(
                'Invalid token provided',
                status.HTTP_401_UNAUTHORIZED,
                {
                    'detail': str(e)
                }
            )
        except TokenError as e:
            # General Token Error
            return map_api_error_as_resp(
                'Token error occurred',
                status.HTTP_401_UNAUTHORIZED,
                {
                    'detail': str(e)
                }
            )
        except ValidationError as e:
            # Validation error
            return map_api_error_as_resp(
                'Validation error occurred',
                status.HTTP_400_BAD_REQUEST,
                {
                    'detail': str(e)
                }
            )
        except Exception as e:
            # Other error
            return map_api_error_as_resp(
                'Token verification failed',
                status.HTTP_400_BAD_REQUEST,
                {
                    'detail': str(e)
                }
            )


class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            if response.status_code == status.HTTP_200_OK:
                return map_to_api_response_as_resp(
                    response.data,
                    "Token refreshed successfully",
                    status.HTTP_200_OK)
            else:
                return map_api_error_as_resp(
                    'Token refresh failed',
                    response.status_code,
                    response.data)
        except InvalidToken as e:
            # invalid token
            return map_api_error_as_resp(
                'Invalid token provided',
                status.HTTP_401_UNAUTHORIZED,
                {
                    'detail': str(e)
                }
            )
        except TokenError as e:
            # General token error
            return map_api_error_as_resp(
                'Token error occurred',
                status.HTTP_401_UNAUTHORIZED,
                {
                    'detail': str(e)
                }
            )
        except Exception as e:
            # Other error
            return map_api_error_as_resp(
                'Token refresh failed',
                status.HTTP_400_BAD_REQUEST,
                {
                    'detail': str(e)
                }
            )
