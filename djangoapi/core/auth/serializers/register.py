from rest_framework import serializers
from core.auth.serializers.user import UserSerializer

#from core.user.serializers import UserSerializer


#from core.auth.serializers.register import RegisterSerializer

from core.user.models import User

#class RegisterSerializer(UserSerializer):


from rest_framework import serializers
from core.user.models import User

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=128, min_length=4, write_only=True, required=True)

    class Meta:
        model = User
        fields = ['public_id', 'email', 'username', 'first_name', 'last_name', 'password']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)