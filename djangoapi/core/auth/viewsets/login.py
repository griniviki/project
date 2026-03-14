from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from core.auth.serializers import LoginSerializer

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

class LoginViewSet(ViewSet):
    serializer_class = LoginSerializer
    permission_classes = (AllowAny,) 
    authentication_classes = []  # ✅ prevents CSRF/session auth issues
    http_method_names = ['post']

    @swagger_auto_schema(
        request_body=LoginSerializer,
        responses={200: LoginSerializer}
    )

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])
        return Response(serializer.validated_data,status=status.HTTP_200_OK)




from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(["GET"])
def debug_auth(request):
    return Response({
        "HTTP_AUTHORIZATION": request.META.get("HTTP_AUTHORIZATION"),
        "AUTHORIZATION": request.META.get("AUTHORIZATION"),
    })



