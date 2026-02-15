from django.contrib import admin
from django.urls import path, re_path, include
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from core.routers import router, posts_router
from core.comment.viewsets import CommentViewSet
from core.views import debug_view 

schema_view = get_schema_view(
    openapi.Info(
        title="Your API Title",
        default_version='v1',
        description="API documentation",
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

@api_view(['GET'])
def api_root(request):
    return Response({
        "users": request.build_absolute_uri("user/"),
        "posts": request.build_absolute_uri("post/"),
        "auth": {
            "register": request.build_absolute_uri("auth/register/"),
            "login": request.build_absolute_uri("auth/login/"),
            "refresh": request.build_absolute_uri("auth/refresh/"),
        }
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/', include(posts_router.urls)),
    path('api-root/', api_root, name='api-root'),
    path('api/post/<str:post_public_id>/comment/', CommentViewSet.as_view({'post': 'create'})),
    re_path(r'^swagger(?P<format>\.json|\.yaml)$',
            schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0),
         name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0),
         name='schema-redoc'),
    path("api/debug/", debug_view),

]
