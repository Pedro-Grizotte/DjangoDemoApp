from django.db.models import Count
from django.db.models.functions import TruncMonth
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
    
class TrabalhoDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = TrabalhoSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Trabalho.objects.select_related("empresa").annotate(contagem_candidatos=Count("aplicacoes"))
    
class CandidatosDoTrabalhoView(generics.ListAPIView):
    serializer_class = AplicacaoSerializer
    permission_classes = [permissions.IsAuthenticated, IsEmpresa]

    def get_queryset(self):
        trabalho = get_object_or_404(
            Trabalho.objects.filter(empresa=self.request.user), pk=self.kwargs["trabalho_id"],
        )
        return Aplicacao.objects.filter(trabalho=trabalho).select_related("trabalho", "candidato", "candidato__candidato_perfil").order_by("-score", "-criado_em")
    
class RelatorioTrabalhosView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsEmpresa]

    def get(self, request, *args, **kwargs):
        trabalhos = Trabalho.objects.filter(empresa=request.user)
        aplicacoes = Aplicacao.objects.filter(trabalho__empresa=request.user)

        trabalhos_por_mes = trabalhos.annotate(mes=TruncMonth("criado_em")).values("mes").annotate(contagem=Count("id")).order_by("mes")
        aplicacoes_por_mes = aplicacoes.annotate(mes=TruncMonth("criado_em")).values("mes").annotate(contagem=Count("id")).order_by("mes")
        meses = {
            1: "Jan",
            2: "Fev",
            3: "Mar",
            4: "Abr",
            5: "Mai",
            6: "Jun",
            7: "Jul",
            8: "Ago",
            9: "Set",
            10: "Out",
            11: "Nov",
            12: "Dez",
        }

        return Response(
            {
                "total_vagas": trabalhos.count(),
                "total_candidaturas": aplicacoes.count(),
                "vagas_por_mes": [
                    {
                        "mes": meses[item["mes"].month],
                        "contagem": item["contagem"],
                    }
                    for item in trabalhos_por_mes
                    if item["mes"] is not None
                ],
                "candidaturas_por_mes": [
                    {
                        "mes": meses[item["mes"].month],
                        "contagem": item["contagem"],
                    }
                    for item in aplicacoes_por_mes
                    if item["mes"] is not None
                ],
            }
        )
