import pytest
from rest_framework.test import APIRequestFactory

from apps.contas.models import NivelEducacao, TipoUsuario
from apps.trabalhos.models import Aplicacao, Trabalho
from apps.trabalhos.serializers import AplicacaoSerializer, TrabalhoSerializer

@pytest.mark.django_db
def test_trabalho_serializer_cria_vaga_para_empresa(empresa):
    request = APIRequestFactory().post("/fake")
    request.user = empresa

    serializer = TrabalhoSerializer(data={
        "nome": "Nova vaga",
        "range_salario": "FROM_1000_TO_2000",
        "requisitos": "Python e Django",
        "educacao_minima": NivelEducacao.ENSINO_MEDIO,
    }, 
        context={"request": request}
    )
    assert serializer.is_valid(), serializer.errors
    trabalho = serializer.save()
    assert Trabalho.objects.filter(pk=trabalho.pk, empresa=empresa).exists()

@pytest.mark.django_db
def test_trabalho_serializer_impede_candidato_de_criar_vaga(candidato_com_perfil):
    request = APIRequestFactory().post("/fake")
    request.user = candidato_com_perfil

    serializer = TrabalhoSerializer(data={
        "nome": "Nova vaga",
        "range_salario": "FROM_1000_TO_2000",
        "requisitos": "Python e Django",
        "educacao_minima": NivelEducacao.ENSINO_MEDIO,
    }, 
        context={"request": request}
    )
    assert serializer.is_valid(), serializer.errors
    with pytest.raises(Exception):
        serializer.save()

@pytest.mark.django_db
def test_aplicacao_serializer_impede_candidato_sem_perfil(candidato, trabalho):
    request = APIRequestFactory().post("/fake")
    request.user = candidato

    serializer = AplicacaoSerializer(data={"trabalho": trabalho.id}, context={"request": request})
    assert not serializer.is_valid()
    assert "trabalho" in serializer.errors

@pytest.mark.django_db
def test_aplicacao_serializer_impede_candidatura_duplicada(candidato_com_perfil, trabalho):
    Aplicacao.objects.create(candidato=candidato_com_perfil, trabalho=trabalho)

    request = APIRequestFactory().post("/fake")
    request.user = candidato_com_perfil

    serializer = AplicacaoSerializer(data={"trabalho": trabalho.id}, context={"request": request})
    assert not serializer.is_valid()
    assert "trabalho" in serializer.errors