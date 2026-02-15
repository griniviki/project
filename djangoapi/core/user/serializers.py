from core.abstract.serializers import AbstractSerializer
from core.user.models import User


class UserSerializer(AbstractSerializer):
    class Meta:
        model = User
        # List of all the fields that can be included in a request or a response
        fields = ['id', 'username', 'first_name', 'last_name', 'bio', 'avatar', 'email', 'is_active',
                  'created', 'updated']
        # List of all the fields that can only be read by the user
        read_only_field = ['is_active']



#from rest_framework import serializers
#from core.user.models import User

#class UserSerializer(serializers.ModelSerializer):
    #id = serializers.UUIDField()
    #created = serializers.DateTimeField(read_only=True)
    #updated = serializers.DateTimeField(read_only=True)

    #class Meta:
        #model = User
        #fields = ['id', 'username', 'first_name', 'last_name', 'email', 'is_active', 'created', 'updated']
        #read_only_fields = ['is_active']


