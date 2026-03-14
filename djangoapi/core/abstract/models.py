import uuid
from django.db import models
from django.core.exceptions import ObjectDoesNotExist

class AbstractManager(models.Manager):
    def get_object_by_public_id(self, public_id):
        try:
            return self.get(public_id=public_id)
        except ObjectDoesNotExist:
            return None  # safer for model layer; raise Http404 in views

class AbstractModel(models.Model):
    public_id = models.UUIDField(
        primary_key=True,          # make UUID the primary key
        default=uuid.uuid4,
        editable=False,
        unique=True,
        db_index=True
    )
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    objects = AbstractManager()

    class Meta:
        abstract = True