from rest_framework.permissions import BasePermission

class IsDonoEmpresaDoTrabalho(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.is_authenticated and obj.empresa_id == request.user.id