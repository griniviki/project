from django.urls import path
from .views import SimpleLoginView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('api/token/', SimpleLoginView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]



