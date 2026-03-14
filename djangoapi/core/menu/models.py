from django.db import models
from django.conf import settings

class Menu(models.Model):
    name = models.CharField(max_length=100)
    items = models.JSONField()  # JSON array of dishes

    def __str__(self):
        return self.name


class Cart(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    items = models.JSONField(default=list)  # array of {id, name, price, quantity}
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Cart for {self.user}"