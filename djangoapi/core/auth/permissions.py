from rest_framework.permissions import BasePermission, SAFE_METHODS

class UserPermission(BasePermission):
    def has_permission(self, request, view):
        # Only authenticated users can create
        if request.method in SAFE_METHODS:
            return True
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Only author can update/delete
        if request.method in SAFE_METHODS:
            return True
        return getattr(obj, "author", None) == request.user
