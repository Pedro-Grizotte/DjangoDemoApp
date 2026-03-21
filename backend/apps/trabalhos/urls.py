from django.urls import path
from apps.trabalhos.views import (
    TrabalhoListCreateView,
    TrabalhoDetailView,
    AplicacaoCreateView,
    MinhasAplicacoesView,
    CandidatosDoTrabalhoView,
    RelatorioTrabalhosView,
)

urlpatterns = [
    path("", TrabalhoListCreateView.as_view(), name="trabalhos-list-create"),
    path("<int:pk>/", TrabalhoDetailView.as_view(), name="trabalhos-detalhes"),
    path("aplicacoes/", MinhasAplicacoesView.as_view(), name="aplicacoes-minhas"),
    path("aplicacoes/criar/", AplicacaoCreateView.as_view(), name="aplicacoes-criar"),
    path("<int:trabalho_id>/candidatos/", CandidatosDoTrabalhoView.as_view(), name="trabalhos-candidatos"),
    path("relatorios/", RelatorioTrabalhosView.as_view(), name="trabalhos-relatorios"),
]
