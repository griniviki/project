from django.http import Http404
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework import status

from core.abstract.viewsets import AbstractViewSet
from core.comment.models import Comment
from core.comment.serializers import CommentSerializer
from core.auth.permissions import UserPermission
from core.post.models import Post
import uuid


def get_post_from_hex(hex_id):
    try:
        return Post.objects.get(public_id=uuid.UUID(hex_id))
    except (Post.DoesNotExist, ValueError):
        raise Http404("Post not found")


class CommentViewSet(AbstractViewSet):
    http_method_names = ("post", "get", "put", "delete")
    authentication_classes = [JWTAuthentication]
    permission_classes = (UserPermission,)
    serializer_class = CommentSerializer
    lookup_field = "public_id"

    def get_queryset(self):
        """Return comments for a specific post (looked up by hex UUID)."""
        if getattr(self, "swagger_fake_view", False):
            return Comment.objects.none()

        post_hex = self.kwargs.get("post_public_id")  # <-- use consistently
        if not post_hex:
            raise Http404("Post ID not provided")

        post = get_post_from_hex(post_hex)
        return Comment.objects.filter(post=post)

    def get_object(self):
        """Return a single comment instance."""
        obj = Comment.objects.get_object_by_public_id(self.kwargs["pk"])
        self.check_object_permissions(self.request, obj)
        return obj

    def perform_create(self, serializer):
        """Attach author + post when creating a comment."""
        post_hex = self.kwargs.get("post_public_id")
        post = get_post_from_hex(post_hex)
        serializer.save(author=self.request.user, post=post)

    def create(self, request, *args, **kwargs):
        """Override create for debug logging."""
        print("==== DEBUG CREATE ====")
        print("Request headers:", request.headers)
        print("Request user:", request.user)
        print("Is authenticated:", request.user.is_authenticated)
        print("Authorization header:", request.headers.get("Authorization"))
        print("DEBUG request.data:", request.data)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
