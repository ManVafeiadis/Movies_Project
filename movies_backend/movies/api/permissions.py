from rest_framework import permissions

class IsAdminUserOrReadOnly(permissions.IsAdminUser):

    def has_permission(self, request, view):
        is_admin = super().has_permission(request, view)
        return request.method in permissions.SAFE_METHODS or is_admin
    

class IsNotAuthenticated(permissions.BasePermission):
   
    def has_permission(self, request, view):
        return not request.user.is_authenticated    