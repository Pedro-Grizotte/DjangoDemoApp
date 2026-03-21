from django.db.models import Count
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.contas.permissions import IsCandidato, IsEmpresa
from apps.trabalhos.models import Trabalho, Aplicacao
from apps.trabalhos.permissoes import isDonoEmpresaDoTrabalho
from apps.trabalhos.serializers import TrabalhoSerializer, AplicacaoSerializer

# Views relacionado aos Trabalhos
class TrabalhoListCreateView(generics.ListCreateAPIView):
    serializer_class = TrabalhoSerializer

    def get_queryset(self):
        return Trabalho.objects.annotate(contagem_candidatos=Count("aplicacoes")).order_by("-criado_em")
    
    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.IsAuthenticated(), IsEmpresa()]
        return [permissions.AllowAny()]
    
class TrabalhoDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = TrabalhoSerializer
    queryset = Trabalho.objects.annotate(contagem_candidatos=Count("aplicacoes"))
    permission_classes = [permissions.IsAuthenticated, isDonoEmpresaDoTrabalho]

class AplicacaoCreateView(generics.CreateAPIView):
    serializer_class = AplicacaoSerializer
    permission_classes = [permissions.IsAuthenticated, IsCandidato] 

class MinhasAplicacoesView(generics.ListAPIView):
    serializer_class = AplicacaoSerializer
    permission_classes = [permissions.IsAuthenticated, IsCandidato]

    def get_queryset(self):
        return Aplicacao.objects.filter(candidato=self.request.user).select_related("trabalho", "candidato")
    
class CandidatosDoTrabalhoView(generics.ListAPIView):
    serializer_class = AplicacaoSerializer
    permission_classes = [permissions.IsAuthenticated, IsEmpresa]

    def get_queryset(self):
        trabalho_id = self.kwargs["trabalho_id"]
        return Aplicacao.objects.filter(
            trabalho_id=trabalho_id,
            trabalho__empresa=self.request.user,
        ).select_related("trabalho", "candidato")
    
class RelatorioTrabalhosView(APIView):
      permission_classes = [permissions.IsAuthenticated, IsEmpresa]

      def get(self, request, *args, **kwargs):
          # Aqui voce implementa agregacoes e indicadores depois.
          return Response({"detail": "Implementar relatorios."}, status=501)