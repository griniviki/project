from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from core.abstract.serializers import AbstractSerializer
from core.user.models import User
from core.user.serializers import UserSerializer
from core.comment.models import Comment
from core.post.models import Post

# I can also tweak it so the Post ID in hex always has 32 chars lowercase
#  (like the Comment ID), for consistency.

class CommentSerializer(AbstractSerializer):
    body = serializers.CharField(required=True)
    edited = serializers.BooleanField(required=False)
    author = serializers.ReadOnlyField(source="author.public_id")
    post = serializers.SerializerMethodField()

    def get_post(self, obj):
        # Ensure post ID is always 32-character lowercase hex
        return obj.post.public_id.hex.lower()

    def validate_author(self, value):
        if self.context["request"].user != value:
            raise ValidationError("You can't create a comment for another user.")
        return value

    def validate_post(self, value):
        if self.instance:
            return self.instance.post
        return value

    def update(self, instance, validated_data):
        if not instance.edited:
            validated_data["edited"] = True
        return super().update(instance, validated_data)

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        author = User.objects.get_object_by_public_id(rep["author"])
        rep["author"] = UserSerializer(author).data
        return rep

    class Meta:
        model = Comment
        fields = ["id", "post", "author", "body", "edited", "created", "updated"]
        extra_kwargs = {
            "body": {"required": True},
            "edited": {"required": False},
            "post": {"read_only": True},
            "author": {"read_only": True},
        }
