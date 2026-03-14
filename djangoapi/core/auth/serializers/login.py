from django.contrib.auth.models import update_last_login
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.settings import api_settings

from core.user.serializers import UserSerializer


class LoginSerializer(TokenObtainPairSerializer):
    # ✅ Tell SimpleJWT to authenticate using email
    username_field = "email"

    def validate(self, attrs):
        # ✅ This authenticates the user and also returns default tokens
        data = super().validate(attrs)

        # ✅ Add user data to the response
        data["user"] = UserSerializer(self.user).data

        # ✅ Update last login (optional, but good practice)
        if api_settings.UPDATE_LAST_LOGIN:
            update_last_login(None, self.user)

        # ✅ data already contains:
        # data["refresh"] and data["access"]
        return data
