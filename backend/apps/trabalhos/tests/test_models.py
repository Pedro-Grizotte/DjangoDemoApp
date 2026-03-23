import pytest
from django.core.exceptions import ValidationError

from apps.contas.models import NivelEducacao
from apps.trabalhos.models import Aplicacao, RangeSalarios, Trabalho, salario_metas

@pytest.mark.django_db
def test_trabalho_nao_aceita_nome_vazio(empresa):
    trabalho = Trabalho(
        empresa=empresa,
        nome="   ",
        range_salario=RangeSalarios.ATE_1000,
        requisitos="Django",
        educacao_minima=NivelEducacao.ENSINO_MEDIO,
    )
    with pytest.raises(ValidationError):
        trabalho.full_clean()

@pytest.mark.django_db
def test_aplicacao_calcula_score_2_quando_salario_e_educacao_batem(candidato_com_perfil, trabalho):
    aplicacao = Aplicacao.objects.create(candidato=candidato_com_perfil, trabalho=trabalho)
    assert aplicacao.score == 2

@pytest.mark.django_db
def test_aplicacao_recalcula_score_quando_vaga_muda(aplicacao, trabalho):
    assert aplicacao.score == 2

    trabalho.range_salario = RangeSalarios.ATE_1000
    trabalho.educacao_minima = NivelEducacao.DOUTORADO
    trabalho.save()

    aplicacao.refresh_from_db()
    assert aplicacao.score == 0

def test_salario_metas_cobre_faixas():
    assert salario_metas(1000, RangeSalarios.ATE_1000) is True
    assert salario_metas(1500, RangeSalarios.DE_1000_ATE_2000) is True
    assert salario_metas(2500, RangeSalarios.DE_2000_ATE_3000) is True
    assert salario_metas(4000, RangeSalarios.ACIMA_3000) is True
    assert salario_metas(3500, RangeSalarios.DE_2000_ATE_3000) is False