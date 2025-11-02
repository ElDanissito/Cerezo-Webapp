from rest_framework.permissions import BasePermission, SAFE_METHODS


class AdminOnly(BasePermission):
    """Allow access only to authenticated admin users (is_staff or superuser).

    - Requires JWT auth (handled by DEFAULT_AUTHENTICATION_CLASSES).
    - Denies anonymous users.
    - Accepts methods read/write uniformly if user is admin.
    """

    message = "Admin privileges required."

    def has_permission(self, request, view):
        user = getattr(request, "user", None)
        if not user or not user.is_authenticated:
            return False
        return bool(user.is_staff or user.is_superuser)
