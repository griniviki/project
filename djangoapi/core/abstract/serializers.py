#All the objects sent back as a response in our API will contain the id, created, and updated fields.
#It’ll be repetitive to write these fields all over again on every ModelSerializer, so let’s just create
#an AbstractSerializer class.

from rest_framework import serializers
class AbstractSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(source='public_id', read_only=True, format='hex')
    created = serializers.DateTimeField(read_only=True)
    updated = serializers.DateTimeField(read_only=True)


#you can go and subclass the UserSerializer class with the
#AbstractSerializer class core/user/serializers.py
