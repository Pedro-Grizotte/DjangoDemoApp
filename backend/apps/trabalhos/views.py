from django.db.models import Count
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.contas.permissions import IsCandidato, IsEmpresa
from apps.trabalhos.models import Trabalho, Aplicacao
from apps.trabalhos.permissoes import IsDonoEmpresaDoTrabalho
from apps.trabalhos.serializers import TrabalhoSerializer, AplicacaoSerializer

# Views relacionado aos Trabalhos
class TrabalhoListCreateView(generics.ListCreateAPIView):
    serializer_class = TrabalhoSerializer

    def get_queryset(self):
        return Trabalho.objects.select_related("empresa").annotate(contagem_candidatos=Count("aplicacoes")).order_by("-criado_em")
    
    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.IsAuthenticated(), IsEmpresa()]
        return [permissions.AllowAny()]
    
class MinhaVagaListView(generics.ListAPIView):
    serializer_class = TrabalhoSerializer
    permission_classes = [permissions.IsAuthenticated, IsEmpresa]

    def get_queryset(self):
        return Trabalho.objects.filter(empresa=self.request.user).select_related("empresa").annotate(contagem_candidatos=Count("aplicacoes")).order_by("-criado_em")
    
class MinhaVagaDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TrabalhoSerializer
    permission_classes = [permissions.IsAuthenticated, IsEmpresa, IsDonoEmpresaDoTrabalho]

    def get_queryset(self):
        return Trabalho.objects.filter(empresa=self.request.user).select_related("empresa").annotate(contagem_candidatos=Count("aplicacoes"))
    
class AplicacaoCreateView(generics.CreateAPIView):
    serializer_class = AplicacaoSerializer
    permission_classes = [permissions.IsAuthenticated, IsCandidato]

class MinhasAplicacoesView(generics.ListAPIView):
    serializer_class = AplicacaoSerializer
    permission_classes = [permissions.IsAuthenticated, IsCandidato]

    def get_queryset(self):
        return Aplicacao.objects.filter(candidato=self.request.user).select_related("trabalho", "candidato", "trabalho__empresa").order_by("-criado_em")
    
class CandidatosDoTrabalhoView(generics.ListAPIView):
    serializer_class = AplicacaoSerializer
    permission_classes = [permissions.IsAuthenticated, IsEmpresa]

    def get_queryset(self):
        trabalho = get_object_or_404(Trabalho.objects.filter(empresa=self.request.user), pk=self.kwargs["trabalho_id"])
        return Aplicacao.objects.filter(trabalho=trabalho).select_related("trabalho", "candidato").order_by("-score", "-criado_em")
    
class RelatorioTrabalhosView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsEmpresa]

    def get(self, request, *args, **kwargs):
        return Response({"detail": "Implementar relatorios."}, status=501)
    
class TrabalhoDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = TrabalhoSerializer
    queryset = Trabalho.objects.annotate(contagem_candidatos=Count("aplicacoes"))
    permission_classes = [permissions.IsAuthenticated, IsDonoEmpresaDoTrabalho]

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