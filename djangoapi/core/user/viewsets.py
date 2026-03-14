from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import PermissionDenied
from core.abstract.viewsets import AbstractViewSet
from core.user.serializers import UserSerializer
from core.user.models import User

class UserViewSet(AbstractViewSet):
    http_method_names = ("get", "patch", "put")
    permission_classes = (IsAuthenticated,)
    authentication_classes = [JWTAuthentication]   # ✅ force JWT
    serializer_class = UserSerializer
    lookup_field = "public_id"

    def get_queryset(self):
        if self.request.user.is_superuser:
            return User.objects.all()
        return User.objects.exclude(is_superuser=True)

    def get_object(self):
        obj = User.objects.get_object_by_public_id(self.kwargs["public_id"])
        if obj != self.request.user and not self.request.user.is_superuser:
            raise PermissionDenied("You can only update your own profile.")
        return obj