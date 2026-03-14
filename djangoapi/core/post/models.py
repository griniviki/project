from django.db import models
from django.conf import settings
from core.abstract.models import AbstractModel, AbstractManager


class PostManager(AbstractManager):
    pass


class Post(AbstractModel):
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,   # ✅ use AUTH_USER_MODEL to avoid circular dependency
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="posts"
    )
    body = models.TextField()
    edited = models.BooleanField(default=False)

    objects = PostManager()

    def __str__(self):
        return f"{self.author.name if self.author else 'Unknown Author'}"

    class Meta:
        db_table = "core_post"