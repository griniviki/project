from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response

from core.user.serializers import UserSerializer


@api_view(["GET"])
@authentication_classes([JWTAuthentication])  # ✅ force JWT
@permission_classes([IsAuthenticated])        # ✅ require login
def me(request):
    return Response(UserSerializer(request.user).data)
