from rest_framework.permissions import BasePermission

from apps.contas.models import TipoUsuario

class IsEmpresa(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.tipo == TipoUsuario.EMPRESA
        )

class IsCandidato(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.tipo == TipoUsuario.CANDIDATO
        )
