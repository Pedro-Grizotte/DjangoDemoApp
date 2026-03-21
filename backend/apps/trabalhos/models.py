from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models

from apps.contas.models import NivelEducacao

# Models relacionado aos Trabalhos e Canditatura
class RangeSalarios(models.TextChoices):
    ATE_1000 = "UP_TO_1000", "Até 1.000"
    DE_1000_ATE_2000 = "FROM_1000_TO_2000", "De 1.000 a 2.000"
    DE_2000_ATE_3000 = "FROM_2000_TO_3000", "De 2.000 a 3.000"
    ACIMA_3000 = "ABOVE_3000", "Acima de 3.000"

class Trabalho(models.Model):
    empresa = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="trabalhos"
    )
    nome = models.CharField(max_length=255)
    range_salario = models.CharField(max_length=30, choices=RangeSalarios.choices)
    requisitos = models.TextField()
    educacao_minima = models.IntegerField(choices=NivelEducacao.choices)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    def clean(self):
        super().clean()

        if self.empresa and self.empresa.tipo != "EMPRESA":
            raise ValidationError({"empresa": "A vaga deve pertencer a um usuário do tipo empresa"})
        if not self.nome or not self.nome.strip():
            raise ValidationError({"nome": "O nome da vaga é obrigatório."})
        if not self.requisitos or not self.requisitos.strip():
            raise ValidationError({"requisitos": "Os requisitos são obrigatórios."})

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
        constraints = [
          models.UniqueConstraint(fields=["candidato", "trabalho"], name="unique_candidato_trabalho")
        ]

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