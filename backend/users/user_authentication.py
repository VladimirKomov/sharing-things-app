from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend

User = get_user_model()

#get user by email or username
class EmailOrUsernameModelBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            user = User.objects.get(email=username)
        except User.DoesNotExist:
            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                return None
        if user.check_password(password) and self.user_can_authenticate(user):
            return user
        return None