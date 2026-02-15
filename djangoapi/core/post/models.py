from django.db import models
from core.abstract.models import AbstractModel,AbstractManager

from django.conf import settings

class PostManager(AbstractManager):
    pass

class Post(AbstractModel):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    #author = models.ForeignKey(to="core_user.User", on_delete=models.CASCADE)
    body = models.TextField()
    edited = models.BooleanField(default=False)
    objects = PostManager()
    def __str__(self):
        return f"{self.author.name}"
    class Meta:
        db_table = "core_post"
        #db_table = "'core.post'"

