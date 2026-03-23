import pytest
from django.urls import reverse

from apps.contas.models import NivelEducacao, TipoUsuario

@pytest.mark.django_db
def test_registro_view_retorna_token_e_usuario(api_client):
    response = api_client.post(reverse("conta-registro"), {
        "email": "novo@teste.com",
        "senha": "123456",
        "tipo": TipoUsuario.CANDIDATO,
        "candidato_perfil": {
            "salario_expectativa": "1500.00",
            "experiencia": "Python e Django",
            "nivel_educacao": NivelEducacao.SUPERIOR,
        },
    }, 
        format="json"
    )
    assert response.status_code == 201
    assert "token" in response.data
    assert response.data["user"]["email"] == "novo@teste.com"

@pytest.mark.django_db
def test_login_view_retorna_token_e_usuario(api_client, user_factory):
    user_factory(email="login@teste.com", password="123456", tipo=TipoUsuario.EMPRESA)

    response = api_client.post(reverse("conta-login"), {
        "email": "login@teste.com",
        "senha": "123456",
    }, 
        format="json"
    )
    assert response.status_code == 200
    assert "token" in response.data
    assert response.data["user"]["email"] == "login@teste.com"

@pytest.mark.django_db
def test_eu_view_sem_token_retorna_401(api_client):
    response = api_client.get(reverse("conta-eu"))
    assert response.status_code == 401

@pytest.mark.django_db
def test_eu_view_com_token_retorna_usuario(api_client, empresa):
    api_client.force_authenticate(user=empresa)

    response = api_client.get(reverse("conta-eu"))
    assert response.status_code == 200
    assert response.data["email"] == empresa.email