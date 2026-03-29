from rest_framework import serializers
from core.user.models import User

class UserSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)  # ensures Swagger shows UUID format
    created = serializers.DateTimeField(read_only=True)
    updated = serializers.DateTimeField(read_only=True)

    class Meta:
        model = User
        fields = [
            "id", "username", "first_name", "last_name",
            "tel", "avatar", "email", "is_active",
            "created", "updated", "public_id",
            "salary_before_taxes", "salary_after_taxes",
            "pit_rate", "military_tax_rate", "pension_fee"
        ]
        read_only_fields = ["is_active", "salary_after_taxes"]

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)

        total_tax_rate = float(instance.pit_rate) + float(instance.military_tax_rate)
        instance.salary_after_taxes = int(instance.salary_before_taxes * (1 - total_tax_rate))

        instance.save()
        return instance