from django.conf import settings
from django.db import models
from django.core.exceptions import ValidationError

# Models relacionado aos Trabalhos e Canditatura
class RangeSalarios(models.TextChoices):
    ATE_1000 = "UP_TO_1000", "Até 1.000"
    DE_1000_ATE_2000 = FROM_1000_TO_2000 = "FROM_1000_TO_2000", "De 1.000 a 2.000"
    DE_2000_ATE_3000 = "FROM_2000_TO_3000", "De 2.000 a 3.000"
    ACIMA_3000 = "ABOVE_3000", "Acima de 3.000"

class NivelEducacao(models.IntegerChoices):
    FUNDAMENTAL = 1, "Ensino fundamental"
    ENSINO_MEDIO = 2, "Ensino médio"
    TECNOLOGO = 3, "Tecnólogo"
    SUPERIOR = 4, "Ensino Superior"
    POS-GRADUACAO = 5, "Pós / MBA / Mestrado"
    DOUTORADO = 6, "Doutorado"

class Trabalho(models.Model):
    empresa = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="trabalhos"
    )
    nome = models.CharField(max_length=255)
    range_salario = models.CharField(max_length=30, choices=RangeSalarios.choices)
    requisitos = models.TextField()
    educacao_minima = models.IntegerField(choices=NivelEducacao.choises)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    def clean(self):
        super().clean()

        if self.empresa and self.empresa.tipo != "EMPRESA":
            raise ValidationError({"EMPRESA": "A vaga deve pertencer a um usuário do tipo empresa"})
        if not self.nome or not self.nome.strip():
            raise ValidationError({"nome": "O nome da vaga é obrigatório."})
        if not self.requisitos or not self.requisitos.strip():
            raise ValidationError({"requisitos": "Os requisitos são obrigatórios."})
        
class PerfilCandidatos(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="candidato_perfil"
    ) 
    salario_expectativa = models.DecimalField(max_digits=10, decimal_places=2)
    experiencia = models.TextField()
    nivel_educacao = models.IntegerField(choices=NivelEducacao.choices)

    def clean(self):
        super().clean()

        if self.user and self.user.tipo != "CANDIDATO":
            raise ValidationError({"candidato": "O perfil do candidato só pode ser vinculado a usuário candidato."})
        if self.salario_expectativa is None or self.salario_expectativa < 0:
            raise ValidationError({"salario_expectativa": "A pretensão salarial deve ser maior ou igual a zero."})
        if not self.experiencia or not self.experiencia.strip():
            raise ValidationError({"experiencia": "A experiência é obrigatória."})
        
class Aplicacao(models.Model):
    candidato = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="aplicacoes"
    )
    trabalho = models.ForeignKey(
        Trabalho,
        on_delete=models.CASCADE,
        related_name="aplicacoes"
    )
    score = models.PositiveSmallIntegerField(default=0)
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_juntos = ("candidato", "trabalho")

    def clean(self):
        super().clean()

        if self.candidato and self.candidato.tipo != "CANDIDATO":
            raise ValidationError({"candidato": "Somente usuários candidatos podem se candidatar."})
        if self.trabalho and self.trabalho.empresa_id == self.candidato_id:
            raise ValidationError({"candidato": "A empresa não pode se candidatar à própria vaga."})
        
    def save(self, *args, **kwargs):
        self.full_clean()
        self.score = self.calcular_score()
        super().save(*args, **kwargs)

    def calcular_score(self):
        pontos = 0

        perfil = getattr(self.candidato, "candidato_perfil", None)
        if not perfil:
            return 0
        
        if salario_metas(perfil.salario_expectativa, self.trabalho.range_salario):
            pontos += 1
        if perfil.nivel_educacao >= self.trabalho.educacao_minima:
            pontos += 1
        return pontos
    
def salario_metas(expectativa, range_salario):
    if range_salario == RangeSalarios.ATE_1000:
        return expectativa <= 1000
    if range_salario == RangeSalarios.DE_1000_ATE_2000:
        return 1000 <= expectativa <= 2000
    if range_salario == RangeSalarios.DE_2000_ATE_3000:
        return 2000 <= expectativa <= 3000
    if range_salario == RangeSalarios.ACIMA_3000:
        return expectativa > 3000
    return False