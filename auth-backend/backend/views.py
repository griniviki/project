from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework import status

class SimpleLoginView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        print(f"Login attempt: {username}")
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            print("Login successful")
        else:
            print("Login failed")

        return response

