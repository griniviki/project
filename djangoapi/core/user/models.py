
import uuid
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin 
from django.db import models
from core.abstract.models import AbstractModel, AbstractManager

#from django.core.exceptions import ObjectDoesNotExist
#from django.http import Http404

class UserManager(BaseUserManager, AbstractManager):
    #def get_object_by_public_id(self, public_id):
        #try:
            #isinstance = self.get(public_id=public_id)
            #return isinstance
        #except (ObjectDoesNotExist, ValueError, TypeError):
            #raise Http404("User not found.")

    def create_user(self, username, email, password=None, **kwargs):
        #first_name = kwargs.pop('first_name', '')
        #last_name = kwargs.pop('last_name', '')

        if username is None:
            raise TypeError('Users must have a username.')
        if email is None:
            raise TypeError('Users must have an email.')
        if password is None:
            raise TypeError('Users must have a password.')

        user = self.model(username=username, email=self.normalize_email(email), **kwargs)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **kwargs):
        #kwargs.setdefault('first_name', 'Admin')
        #kwargs.setdefault('last_name', 'User')

        user = self.create_user(username=username, email=email, password=password, **kwargs)
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
        return user
class User(AbstractModel, AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(db_index=True, max_length=255, unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField(db_index=True, unique=True)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)  # You need this if using Django admin
    #created = models.DateTimeField(auto_now_add=True)
    #updated = models.DateTimeField(auto_now=True)
    bio = models.TextField(blank=True, null=True)
    avatar = models.ImageField(null=True)
    posts_liked = models.ManyToManyField("core_label.Post", related_name="liked_by")

    #posts_liked = models.ManyToManyField("core_post.Post", related_name="liked_by")
    

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = UserManager()

    def __str__(self):
        return self.email

    #@property
    #def name(self):
        #return f"{self.first_name} {self.last_name}"

    @property
    def name(self):
        return f"{self.first_name} {self.last_name}"
    def like(self, post):
        """Like `post` if it hasn't been done yet"""
        return self.posts_liked.add(post)

    def remove_like(self, post):
        """Remove a like from a `post`"""
        return self.posts_liked.remove(post)

    def has_liked(self, post):
        """Return True if the user has liked a `post`; else False"""
        return self.posts_liked.filter(pk=post.pk).exists()



