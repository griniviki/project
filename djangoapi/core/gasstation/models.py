from django.db import models


class Car(models.Model):
    FUEL_TYPES = [
        ("petrol", "Petrol"),
        ("diesel", "Diesel"),
        ("electric", "Electric"),
    ]

    brand = models.CharField(max_length=100)
    fuel_type = models.CharField(max_length=20, choices=FUEL_TYPES)
    tank_capacity = models.FloatField()
    current_fuel = models.FloatField()

    def __str__(self):
        return f"{self.brand} ({self.fuel_type})"


class GasStation(models.Model):
    name = models.CharField(max_length=100)

    # Example:
    # { "petrol": 55, "diesel": 52, "electric": 12 }
    fuel_prices = models.JSONField(default=dict)

    def __str__(self):
        return self.name


