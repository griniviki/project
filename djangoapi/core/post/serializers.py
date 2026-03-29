# core/post/serializers.py
from rest_framework import serializers
from core.abstract.serializers import AbstractSerializer
from core.post.models import Post, PostMetadata
from core.user.serializers import UserSerializer


class PostMetadataSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostMetadata
        fields = ["language", "category", "title", "body"]


class PostSerializer(AbstractSerializer):
    author = serializers.SerializerMethodField(read_only=True)
    liked = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    metadata = PostMetadataSerializer(many=True, required=False)

    def get_author(self, instance):
        if instance.author:
            return UserSerializer(instance.author).data
        return {"id": None, "username": "Unknown", "email": ""}

    def get_liked(self, instance):
        request = self.context.get("request")
        if not request or request.user.is_anonymous:
            return False
        return request.user.has_liked(instance)

    def get_likes_count(self, instance):
        return instance.liked_by.count()

    def create(self, validated_data):
        metadata_data = validated_data.pop("metadata", [])
        post = Post.objects.create(**validated_data)
        for md in metadata_data:
            PostMetadata.objects.create(post=post, **md)
        return post

    def update(self, instance, validated_data):
        metadata_data = validated_data.pop("metadata", [])
        if not instance.edited:
            validated_data["edited"] = True

        instance = super().update(instance, validated_data)

        for md in metadata_data:
            PostMetadata.objects.update_or_create(
                post=instance,
                language=md["language"],
                category=md["category"],
                defaults={"title": md.get("title"), "body": md.get("body")},
            )
        return instance

    class Meta:
        model = Post
        fields = [
            "id",
            "author",
            "body",
            "edited",
            "linguistics_type",   # ✅ NEW FIELD
            "liked",
            "likes_count",
            "created",
            "updated",
            "metadata",
        ]
        read_only_fields = ["edited", "author"]