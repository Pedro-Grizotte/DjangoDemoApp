from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core.exceptions import ValidationError
from django.db import models

# Create your models here.
class TipoUsuario(models.TextChoices):
    EMPRESA = "EMPRESA", "Empresa"
    CANDIDATO = "CANDIDATO", "Candidato"

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
    
    def criar_superuser(self, email, senha=None, **extra_campos):
        extra_campos.setdefault("is_staff", True)
        extra_campos.setdefault("is_superuser", True)

        if extra_campos.get("is_staff") is not True:
            raise ValueError("Superuser precisa ter is_staff=True.")
        if extra_campos.get("is_superuser") is not True:
            raise ValueError("Superuser precisa ter is_superuser=True.")
        return self._criar_usuario(email, senha, **extra_campos)
    
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

