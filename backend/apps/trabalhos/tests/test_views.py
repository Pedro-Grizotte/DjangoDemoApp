import pytest
from django.urls import reverse

from apps.contas.models import NivelEducacao
from apps.trabalhos.models import Aplicacao, Trabalho

@pytest.mark.django_db
def test_listagem_publica_de_vagas(api_client, trabalho):
    response = api_client.get(reverse("trabalhos-list-create"))
    assert response.status_code == 200
    assert len(response.data) == 1

@pytest.mark.django_db
def test_detalhe_publico_da_vaga(api_client, trabalho):
    response = api_client.get(reverse("trabalhos-detail", args=[trabalho.id]))
    assert response.status_code == 200
    assert response.data["id"] == trabalho.id

@pytest.mark.django_db
def test_empresa_pode_criar_vaga(api_client, empresa):
    api_client.force_authenticate(user=empresa)

    response = api_client.post(reverse("trabalhos-list-create"), {
        "nome": "Dev Python",
        "range_salario": "FROM_1000_TO_2000",
        "requisitos": "Django",
        "educacao_minima": NivelEducacao.ENSINO_MEDIO,
    }, 
        format="json"
    )
    assert response.status_code == 201
    assert Trabalho.objects.filter(nome="Dev Python", empresa=empresa).exists()

@pytest.mark.django_db
def test_candidato_nao_pode_criar_vaga(api_client, candidato_com_perfil):
    api_client.force_authenticate(user=candidato_com_perfil)

    response = api_client.post(reverse("trabalhos-list-create"), {
        "nome": "Dev Python",
        "range_salario": "FROM_1000_TO_2000",
        "requisitos": "Django",
        "educacao_minima": NivelEducacao.ENSINO_MEDIO,
    }, 
        format="json"
    )
    assert response.status_code == 403

@pytest.mark.django_db
def test_minhas_vagas_retorna_somente_vagas_da_empresa(api_client, empresa, empresa_2):
    Trabalho.objects.create(
        empresa=empresa,
        nome="Vaga 1",
        range_salario="FROM_1000_TO_2000",
        requisitos="Django",
        educacao_minima=NivelEducacao.ENSINO_MEDIO,
    )
    Trabalho.objects.create(
        empresa=empresa_2,
        nome="Vaga 2",
        range_salario="FROM_1000_TO_2000",
        requisitos="Django",
        educacao_minima=NivelEducacao.ENSINO_MEDIO,
    )
    api_client.force_authenticate(user=empresa)
    response = api_client.get(reverse("trabalhos-minhas-vagas"))

    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]["nome"] == "Vaga 1"

@pytest.mark.django_db
def test_so_dona_pode_editar_vaga(api_client, empresa_2, trabalho):
    api_client.force_authenticate(user=empresa_2)

    response = api_client.patch(reverse("trabalhos-minha-vaga-detail", args=[trabalho.id]), {
        "nome": "Nome alterado",
    }, 
        format="json"
    )
    assert response.status_code == 404

@pytest.mark.django_db
def test_candidato_com_perfil_pode_aplicar(api_client, candidato_com_perfil, trabalho):
    api_client.force_authenticate(user=candidato_com_perfil)

    response = api_client.post(reverse("aplicacoes-criar"), {
        "trabalho": trabalho.id,
    }, 
        format="json"
    )
    assert response.status_code == 201
    assert Aplicacao.objects.filter(candidato=candidato_com_perfil, trabalho=trabalho).exists()

@pytest.mark.django_db
def test_candidato_sem_perfil_nao_pode_aplicar(api_client, candidato, trabalho):
    api_client.force_authenticate(user=candidato)

    response = api_client.post(reverse("aplicacoes-criar"), {
        "trabalho": trabalho.id,
    }, 
        format="json"
    )
    assert response.status_code == 400

@pytest.mark.django_db
def test_empresa_nao_pode_ver_minhas_aplicacoes(api_client, empresa):
    api_client.force_authenticate(user=empresa)

    response = api_client.get(reverse("aplicacoes-minhas"))
    assert response.status_code == 403

@pytest.mark.django_db
def test_empresa_so_ve_candidatos_da_propria_vaga(api_client, empresa_2, trabalho):
    api_client.force_authenticate(user=empresa_2)

    response = api_client.get(reverse("trabalhos-candidatos", args=[trabalho.id]))
    assert response.status_code == 404