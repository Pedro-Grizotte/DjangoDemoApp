import pytest
from rest_framework.test import APIClient

from apps.contas.models import NivelEducacao, PerfilCandidatos, TipoUsuario
from apps.trabalhos.models import Aplicacao, RangeSalarios, Trabalho

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def user_factory(django_user_model):
    def make_usuario(*, email, senha="123456", tipo):
        return django_user_model.objects.criar_usuario(
            email=email,
            senha=senha,
            tipo=tipo,
        )
    return make_usuario

@pytest.fixture
def empresa(user_factory):
    return user_factory(email="empresa@email.com", tipo=TipoUsuario.EMPRESA)

@pytest.fixture
def empresa_2(user_factory):
    return user_factory(email="empresa2@email.com", tipo=TipoUsuario.EMPRESA)

@pytest.fixture
def candidato(user_factory):
    return user_factory(email="candidato@email.com", tipo=TipoUsuario.CANDIDATO)

@pytest.fixture
def candidato_com_perfil(candidato):
    PerfilCandidatos.objects.create(
        user=candidato,
        salario_expectativa=1800,
        experiencia='2 anos com Python',
        nivel_educacao=NivelEducacao.SUPERIOR,
    )
    candidato.refresh_from_db()
    return candidato

@pytest.fixture
def trabalho(empresa):
    return Trabalho.objects.create(
        empresa=empresa,
        nome="Backend Python",
        range_salario=RangeSalarios.DE_1000_ATE_2000,
        requisitos="Django e DRF",
        educacao_minima=NivelEducacao.ENSINO_MEDIO,
    )

@pytest.fixture
def aplicacao(candidato_com_perfil, trabalho):
    return Aplicacao.objects.create(
        candidato=candidato_com_perfil,
        trabalho=trabalho,
    )