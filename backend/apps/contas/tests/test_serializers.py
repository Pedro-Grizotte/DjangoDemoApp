import pytest

from apps.contas.models import NivelEducacao, PerfilCandidatos, TipoUsuario, Usuario
from apps.contas.serializers import LoginSerializer, UsuarioRegistroSerializer

@pytest.mark.django_db
def test_registro_de_candidato_valido_cria_usuario_e_perfil():
    serializer = UsuarioRegistroSerializer(data={
        "email": "novo@teste.com",
        "senha": "123456",
        "tipo": TipoUsuario.CANDIDATO,
        "candidato_perfil": {
            "salario_expectativa": "1500.00",
            "experiencia": "Python e Django",
            "nivel_educacao": NivelEducacao.SUPERIOR,
        },
    })
    assert serializer.is_valid(), serializer.errors
    user = serializer.save()
    assert Usuario.objects.filter(email="novo@teste.com").exists()
    assert PerfilCandidatos.objects.filter(user=user).exists()

@pytest.mark.django_db
def test_registro_de_candidato_sem_perfil_falha():
    serializer = UsuarioRegistroSerializer(data={
        "email": "novo@teste.com",
        "senha": "123456",
        "tipo": TipoUsuario.CANDIDATO,
    })
    assert not serializer.is_valid()
    assert "candidato_perfil" in serializer.errors

@pytest.mark.django_db
def test_registro_de_empresa_com_perfil_falha():
    serializer = UsuarioRegistroSerializer(data={
        "email": "empresa@teste.com",
        "senha": "123456",
        "tipo": TipoUsuario.EMPRESA,
        "candidato_perfil": {
            "salario_expectativa": "1000.00",
            "experiencia": "Nao deveria enviar",
            "nivel_educacao": NivelEducacao.ENSINO_MEDIO,
        },
    })
    assert not serializer.is_valid()
    assert "candidato_perfil" in serializer.errors

@pytest.mark.django_db
def test_login_serializer_com_credenciais_validas(user_factory):
    user_factory(email="login@teste.com", password="123456", tipo=TipoUsuario.EMPRESA)

    serializer = LoginSerializer(data={
        "email": "login@teste.com",
        "senha": "123456",
    }, 
        context={"request": None}
    )
    assert serializer.is_valid(), serializer.errors
    assert serializer.validated_data["user"].email == "login@teste.com"

@pytest.mark.django_db
def test_login_serializer_com_credenciais_invalidas(user_factory):
    user_factory(email="login@teste.com", password="123456", tipo=TipoUsuario.EMPRESA)

    serializer = LoginSerializer(data={
        "email": "login@teste.com",
        "senha": "senha-errada",
    }, 
        context={"request": None}
    )
    assert not serializer.is_valid()
    assert "detail" in serializer.errors