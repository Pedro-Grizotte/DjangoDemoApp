from django.urls import path
from apps.trabalhos.views import (
    AplicacaoCreateView,
    CandidatosDoTrabalhoView,
    MinhasAplicacoesView,
    MinhaVagaDetailView,
    MinhaVagaListView,
    RelatorioTrabalhosView,
    TrabalhoDetailView,
    TrabalhoListCreateView,
)

urlpatterns = [
    path("", TrabalhoListCreateView.as_view(), name="trabalhos-list-create"),
    path("<int:pk>/", TrabalhoDetailView.as_view(), name="trabalhos-detail"),
    path("minhas-vagas/", MinhaVagaListView.as_view(), name="trabalhos-minhas-vagas"),
    path("minhas-vagas/<int:pk>/", MinhaVagaDetailView.as_view(), name="trabalhos-minha-vaga-detail"),
    path("minhas-vagas/<int:trabalho_id>/candidatos/", CandidatosDoTrabalhoView.as_view(), name="trabalhos-candidatos",),
    path("aplicacoes/", AplicacaoCreateView.as_view(), name="aplicacoes-criar"),
    path("aplicacoes/minhas/", MinhasAplicacoesView.as_view(), name="aplicacoes-minhas"),
    path("relatorios/", RelatorioTrabalhosView.as_view(), name="trabalhos-relatorios"),
]
