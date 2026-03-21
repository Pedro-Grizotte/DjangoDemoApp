from django.db.models import Count
from django.db.models.functions import TruncMonth
from rest_framework import generics, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.contas.serializers import UsuarioRegistroSerializer
from .models import Trabalho, Aplicacao
from .serializers import TrabalhoSerializer, AplicacaoSerializer
from .permissoes import isDonoEmpresaDoTrabalho

# Views relacionado aos Trabalhos
class RegistroView(generics.CreateAPIView):
    serializer_class = UsuarioRegistroSerializer
    permission_classes = [permissions.AllowAny]
