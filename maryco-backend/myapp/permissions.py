from rest_framework.permissions import BasePermission


class IsAdminUser(BasePermission):
    """Доступ тільки для користувачів з роллю admin."""
    message = 'Доступ дозволено тільки адміністраторам.'

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            hasattr(request.user, 'role') and
            request.user.role == 'admin'
        )


class IsTeacher(BasePermission):
    """Доступ тільки для користувачів з роллю teacher або admin."""
    message = 'Доступ дозволено тільки викладачам.'

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            hasattr(request.user, 'role') and
            request.user.role in ('teacher', 'admin')
        )
