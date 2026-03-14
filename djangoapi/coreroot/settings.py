from pathlib import Path
from datetime import timedelta

from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from corsheaders.defaults import default_headers


# ===============================
# Swagger
# ===============================
schema_view = get_schema_view(
    openapi.Info(
        title="Your API",
        default_version="v1",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

SWAGGER_SETTINGS = {
    "SECURITY_DEFINITIONS": {
        "Bearer": {
            "type": "apiKey",
            "name": "Authorization",
            "in": "header",
        }
    },
}

SWAGGER_USE_COMPAT_RENDERERS = False

SPECTACULAR_SETTINGS = {
    "TITLE": "Your API",
    "DESCRIPTION": "API documentation",
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
    "COMPONENT_SPLIT_REQUEST": True,
    "AUTHENTICATION_WHITELIST": [],
    "SECURITY_DEFINITIONS": {
        "Bearer": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    },
    "SECURITY": [{"Bearer": []}],
}


# ===============================
# Base
# ===============================
BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = "django-insecure-2$l0sinqwfw_v3#n8if5acz*^z#(^w^@b2++$=-fny!lp@$@t-"
DEBUG = True

ALLOWED_HOSTS = ["192.168.0.104", "127.0.0.1", "localhost", "172.24.134.105"]


# ===============================
# Apps
# ===============================
INSTALLED_APPS = [
    "core",
    "core.user",
    "core.auth",
    "core.post",
    "core.comment",
    "core.menu",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "rest_framework_simplejwt",
    "drf_yasg",
    "corsheaders",
    "django_filters",
]

AUTH_USER_MODEL = "core_user.User"


# ===============================
# DRF
# ===============================
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend"
    ],
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 10,
}


# ===============================
# SimpleJWT
# ===============================
SIMPLE_JWT = {
    "USER_ID_FIELD": "public_id",
    "USER_ID_CLAIM": "user_id",
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": False,
    "BLACKLIST_AFTER_ROTATION": True,
}




# ===============================
# Middleware (✅ FIXED ORDER + ✅ AUTH HEADER FIX)
# ===============================
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",  # ✅ very high
    "core.middleware.AuthorizationHeaderMiddleware",  # ✅ before auth
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]



# ===============================
# URLs / Templates
# ===============================
ROOT_URLCONF = "coreroot.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    }
]

WSGI_APPLICATION = "coreroot.wsgi.application"


# ===============================
# Database
# ===============================
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql_psycopg2",
        "NAME": "coredb",
        "USER": "viki",
        "PASSWORD": "410554",
        "HOST": "127.0.0.1",
        "PORT": "",
    }
}


# ===============================
# Password validation
# ===============================
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
        "OPTIONS": {"min_length": 4},
    },
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]


# ===============================
# Locale / Static
# ===============================
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# ===============================
# CORS (✅ allow Authorization header)
# ===============================
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

CORS_ALLOW_HEADERS = list(default_headers) + [
    "authorization",
]

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
