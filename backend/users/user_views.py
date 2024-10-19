from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .user_serializers import UserSerializer


class UserRegistrationView(APIView):
    def post(self, request):
        # user into serializer
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            # if OK
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        # if errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLogoutView(APIView):
    def post(self, request):
        try:
            request_token = request.data['refresh_token']
            token = RefreshToken(request_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
