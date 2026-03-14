from rest_framework import serializers
from core.user.models import User

class UserSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)  # ensures Swagger shows UUID format
    created = serializers.DateTimeField(read_only=True)
    updated = serializers.DateTimeField(read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'first_name', 'last_name',
            'tel', 'avatar', 'email', 'is_active',
            'created', 'updated', "public_id"
        ]
        read_only_fields = ['is_active']