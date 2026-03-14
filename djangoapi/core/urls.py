from rest_framework_nested import routers
from django.urls import path
from core.user.viewsets import UserViewSet
from core.post.viewsets import PostViewSet
from core.comment.viewsets import CommentViewSet
from core.auth.viewsets import RegisterViewSet, LoginViewSet, RefreshViewSet
from core.user.views import me
from core.auth.viewsets.login import debug_auth
from core.menu.views import add_to_cart, get_cart, get_menu
#from core.menu.views import get_menu, add_dish




# Routers for viewsets
router = routers.SimpleRouter()
router.register(r'user', UserViewSet, basename='user')
router.register(r'auth/register', RegisterViewSet, basename='auth-register')
router.register(r'auth/login', LoginViewSet, basename='auth-login')
router.register(r'auth/refresh', RefreshViewSet, basename='auth-refresh')
router.register(r'post', PostViewSet, basename='post')

posts_router = routers.NestedSimpleRouter(router, r'post', lookup='post')
posts_router.register(r'comment', CommentViewSet, basename='post-comment')

# ✅ urlpatterns must include both router URLs and the custom /auth/me/ path
urlpatterns = [
    *router.urls,
    *posts_router.urls,
    path("auth/me/", me, name="auth-me"),
    path("debug-auth/", debug_auth, name="debug-auth"),
    #path("menu/", get_menu, name="menu"),
    #path("menu/add_dish/", add_dish, name="add-dish"),
    path("cart/add/", add_to_cart, name="cart-add"),
    path("cart/", get_cart, name="cart-view"),
    path("menu/", get_menu, name="menu-view"),

]


