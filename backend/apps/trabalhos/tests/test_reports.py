import pytest
from django.urls import reverse
from django.utils import timezone

from apps.contas.models import NivelEducacao
from apps.trabalhos.models import Aplicacao, Trabalho

@pytest.mark.django_db
def test_relatorio_retorna_totais_da_empresa_logada(api_client, empresa, empresa_2, candidato_com_perfil):
    vaga_empresa = Trabalho.objects.create(
        empresa=empresa,
        nome="Vaga A",
        range_salario="FROM_1000_TO_2000",
        requisitos="Django",
        educacao_minima=NivelEducacao.ENSINO_MEDIO,
    )
    vaga_outra = Trabalho.objects.create(
        empresa=empresa_2,
        nome="Vaga B",
        range_salario="FROM_1000_TO_2000",
        requisitos="Django",
        educacao_minima=NivelEducacao.ENSINO_MEDIO,
    )
    Aplicacao.objects.create(candidato=candidato_com_perfil, trabalho=vaga_empresa)
    Aplicacao.objects.create(candidato=candidato_com_perfil, trabalho=vaga_outra)

    api_client.force_authenticate(user=empresa)
    response = api_client.get(reverse("trabalhos-relatorios"))
    assert response.status_code == 200
    assert response.data["total_vagas"] == 1
    assert response.data["total_candidaturas"] == 1