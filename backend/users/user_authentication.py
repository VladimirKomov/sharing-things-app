from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
from django.db.models import Q
from ..config.logger import logger


User = get_user_model()


# get user by email or username
class EmailOrUsernameModelBackend(ModelBackend):
    def authenticate(self, request, usernameOrEmail=None, password=None, **kwargs):
        logger.info(f"Attempting to authenticate {usernameOrEmail}")
        try:
            user = User.objects.get(Q(email=usernameOrEmail) | Q(username=usernameOrEmail))
        except User.DoesNotExist:
            logger.warning(f"User not found for {usernameOrEmail}")
            return None

        if user.check_password(password) and self.user_can_authenticate(user):
            logger.info(f"User {usernameOrEmail} authenticated successfully")
            return user

        logger.warning(f"Authentication failed for {usernameOrEmail}")
        return None
