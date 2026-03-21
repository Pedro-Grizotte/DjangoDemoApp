from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core.exceptions import ValidationError
from django.db import models

class TipoUsuario(models.TextChoices):
    EMPRESA = "EMPRESA", "Empresa"
    CANDIDATO = "CANDIDATO", "Candidato"

class NivelEducacao(models.IntegerChoices):
    FUNDAMENTAL = 1, "Ensino fundamental"
    ENSINO_MEDIO = 2, "Ensino medio"
    TECNOLOGO = 3, "Tecnologo"
    SUPERIOR = 4, "Ensino Superior"
    POS_GRADUACAO = 5, "Pos / MBA / Mestrado"
    DOUTORADO = 6, "Doutorado"

class ControleUsuario(BaseUserManager):
    use_in_migrations = True

    def _criar_usuario(self, email, senha, **extra_campos):
        if not email:
            raise ValueError("O email é obrigatório.")
        email = self.normalize_email(email)
        user = self.model(email=email, username=email, **extra_campos)
        user.set_password(senha)
        user.full_clean()
        user.save(using=self._db)
        return user
    
    def criar_usuario(self, email, senha=None, **extra_campos):
        extra_campos.setdefault("is_staff", False)
        extra_campos.setdefault("is_superuser", False)
        return self._criar_usuario(email, senha, **extra_campos)

    def create_user(self, email, password=None, **extra_fields):
        return self.criar_usuario(email=email, senha=password, **extra_fields)

    def criar_superuser(self, email, senha=None, **extra_campos):
        extra_campos.setdefault("is_staff", True)
        extra_campos.setdefault("is_superuser", True)

        if extra_campos.get("is_staff") is not True:
            raise ValueError("Superuser precisa ter is_staff=True.")
        if extra_campos.get("is_superuser") is not True:
            raise ValueError("Superuser precisa ter is_superuser=True.")
        return self._criar_usuario(email, senha, **extra_campos)

    def create_superuser(self, email, password=None, **extra_fields):
        return self.criar_superuser(email=email, senha=password, **extra_fields)

class Usuario(AbstractUser):
    username = models.EmailField(unique=True)
    email = models.EmailField(unique=True)
    tipo = models.CharField(max_length=20, choices=TipoUsuario.choices)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []
    objects = ControleUsuario()
    
    def clean(self):
        super().clean()
        if self.username:
            self.username = self.email

class PerfilCandidatos(models.Model):
    user = models.OneToOneField(
        "contas.Usuario",
        on_delete=models.CASCADE,
        related_name="candidato_perfil",
    )
    salario_expectativa = models.DecimalField(max_digits=10, decimal_places=2)
    experiencia = models.TextField()
    nivel_educacao = models.IntegerField(choices=NivelEducacao.choices)

    def clean(self):
        super().clean()

        if self.user and self.user.tipo != TipoUsuario.CANDIDATO:
            raise ValidationError(
                {"user": "O perfil do candidato so pode ser vinculado a usuario candidato."}
            )
        if self.salario_expectativa is None or self.salario_expectativa < 0:
            raise ValidationError(
                {
                    "salario_expectativa": "A pretensao salarial deve ser maior ou igual a zero."
                }
            )
        if not self.experiencia or not self.experiencia.strip():
            raise ValidationError({"experiencia": "A experiencia e obrigatoria."})
