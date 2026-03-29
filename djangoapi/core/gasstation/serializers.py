from rest_framework import serializers
from .models import GasStation
from .models import Car

class CarSerializer(serializers.ModelSerializer):
    fuel_type_display = serializers.SerializerMethodField()

    class Meta:
        model = Car
        fields = ["id", "brand", "fuel_type", "fuel_type_display", "tank_capacity", "current_fuel"]

    def get_fuel_type_display(self, obj):
        return obj.get_fuel_type_display()

class GasStationSerializer(serializers.ModelSerializer):
    class Meta:
        model = GasStation
        fields = "__all__"


