from rest_framework.permissions import BasePermission, SAFE_METHODS

class isEmpresa(BasePermission):
    def possui_permissao(self, request, view):
        return request.user.is_authenticated and request.user.tipo == "EMPRESA"
    
class isCandidato(BasePermission):
    def possui_permissao(self, request, view):
        return request.user.is_authenticated and request.user.tipo == "CANDIDATO"
    
class isDonoEmpresaDoTrabalho(BasePermission):
    def possui_objeto_permissao(self, request, view, obj):
        return request.user.is_authenticated and obj.empresa_id == request.user.id