import pytest

@pytest.fixture
def api_client():
    from rest_framework.test import APIClient

    return APIClient()

@pytest.fixture
def user_factory(django_user_model):
    def make_usuario(*, email, password="123456", tipo):
        return django_user_model.objects.criar_usuario(
            email=email,
            senha=password,
            tipo=tipo,
        )
    return make_usuario

@pytest.fixture
def empresa(user_factory):
    from apps.contas.models import TipoUsuario

    return user_factory(email="empresa@email.com", tipo=TipoUsuario.EMPRESA)

@pytest.fixture
def empresa_2(user_factory):
    from apps.contas.models import TipoUsuario

    return user_factory(email="empresa2@email.com", tipo=TipoUsuario.EMPRESA)

@pytest.fixture
def candidato(user_factory):
    from apps.contas.models import TipoUsuario

    return user_factory(email="candidato@email.com", tipo=TipoUsuario.CANDIDATO)

@pytest.fixture
def candidato_com_perfil(candidato):
    from apps.contas.models import NivelEducacao, PerfilCandidatos

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
    from apps.contas.models import NivelEducacao
    from apps.trabalhos.models import RangeSalarios, Trabalho

    return Trabalho.objects.create(
        empresa=empresa,
        nome="Backend Python",
        range_salario=RangeSalarios.DE_1000_ATE_2000,
        requisitos="Django e DRF",
        educacao_minima=NivelEducacao.ENSINO_MEDIO,
    )

@pytest.fixture
def aplicacao(candidato_com_perfil, trabalho):
    from apps.trabalhos.models import Aplicacao

    return Aplicacao.objects.create(
        candidato=candidato_com_perfil,
        trabalho=trabalho,
    )
