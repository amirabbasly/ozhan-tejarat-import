from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    """
    Allows access only to users with the 'admin' role.
    """
    def has_permission(self, request, view):
        return request.user and request.user.role == 'admin'

class IsEditor(permissions.BasePermission):
    """
    Allows access only to users with the 'editor' role.
    """
    def has_permission(self, request, view):
        return request.user and request.user.role in ['admin', 'editor']

class IsViewer(permissions.BasePermission):
    """
    Allows access only to users with the 'viewer' role.
    """
    def has_permission(self, request, view):
        return request.user and request.user.role in ['admin', 'editor', 'viewer']
