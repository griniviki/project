from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication

from core.abstract.viewsets import AbstractViewSet
from core.post.models import Post
from core.post.serializers import PostSerializer
from core.auth.permissions import UserPermission

from rest_framework import viewsets
from rest_framework.pagination import PageNumberPagination

class PostViewSet(AbstractViewSet):
    http_method_names = ('post', 'get', 'put', 'delete')
    authentication_classes = [JWTAuthentication]  # 👈 you can keep or remove (see note below)
    permission_classes = (UserPermission,)
    serializer_class = PostSerializer
    queryset = Post.objects.all()
    lookup_field = 'public_id'  # <-- add this
    
    def get_queryset(self):
        return Post.objects.all()

    #def get_object(self):
        #obj = Post.objects.get_object_by_public_id(self.kwargs['pk'])
        #self.check_object_permissions(self.request, obj)
        #return obj
    
    def get_object(self):
        lookup_value = self.kwargs[self.lookup_field]  # <- use lookup_field
        obj = Post.objects.get_object_by_public_id(lookup_value)
        self.check_object_permissions(self.request, obj)
        return obj


    def perform_create(self, serializer):
        #post_pk = self.kwargs.get('post_pk')
        #post = Post.objects.get_object_by_public_id(post_pk)
        #serializer.save(author=self.request.user, post=post)
        serializer.save(author=self.request.user)

    def create(self, request, *args, **kwargs):
        # DEBUG START
        print("==== DEBUG CREATE ====")
        print("Request headers:", request.headers)
        print("Request user:", request.user)
        print("Is authenticated:", request.user.is_authenticated)
        print("Authorization header:", request.headers.get("Authorization"))
        # DEBUG END

        return super().create(request, *args, **kwargs)