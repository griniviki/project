from django.db import models
from django.conf import settings
from core.abstract.models import AbstractModel, AbstractManager


class PostManager(AbstractManager):
    pass


class Post(AbstractModel):
    LINGUISTICS_CHOICES = [
        ("none", "None"),
        ("grammar", "Grammar"),
        ("lexis", "Lexis"),
        ("phonetics", "Phonetics"),
    ]

    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="posts"
    )

    body = models.TextField()
    edited = models.BooleanField(default=False)

    # ✅ NEW FIELD (replaces grammar/lexis/phonetics JSONFields)
    linguistics_type = models.CharField(
        max_length=20,
        choices=LINGUISTICS_CHOICES,
        default="none"
    )

    objects = PostManager()

    def __str__(self):
        return f"{self.author.name if self.author else 'Unknown Author'}"

    class Meta:
        db_table = "core_post"


class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)

    class Meta:
        db_table = "core_category"

    def __str__(self):
        return self.name


class Language(models.Model):
    code = models.CharField(max_length=5, primary_key=True)  # e.g. "en", "uk"
    name = models.CharField(max_length=50)

    class Meta:
        db_table = "core_language"

    def __str__(self):
        return self.name


class PostMetadata(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="metadata")
    language = models.ForeignKey(Language, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    title = models.CharField(max_length=200, blank=True, null=True)
    body = models.TextField(blank=True, null=True)

    class Meta:
        db_table = "core_post_metadata"
        unique_together = ("post", "language", "category")

    def __str__(self):
        return f"{self.post.public_id} [{self.language.code} - {self.category.name}]"