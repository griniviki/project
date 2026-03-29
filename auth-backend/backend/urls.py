from django.contrib import admin
from django.urls import path, include
from core import routers

urlpatterns = [
    #path("admin/", admin.site.urls),
    path("api/", include("core.routers")),   # ✅ loads all router + me
    path("api/", include("core.auth.urls")), # ✅ loads token endpoints
    path("api/", include(routers.urlpatterns)),
]


