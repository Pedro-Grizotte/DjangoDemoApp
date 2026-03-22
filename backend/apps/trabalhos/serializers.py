from rest_framework import serializers
from apps.contas.models import TipoUsuario

from .models import Aplicacao, Trabalho

class TrabalhoSerializer(serializers.ModelSerializer):
    contagem_candidatos = serializers.IntegerField(read_only=True)
    empresa_email = serializers.EmailField(source="empresa.email", read_only=True)

    class Meta:
        model = Trabalho
        fields = [
            "id",
            "nome",
            "range_salario",
            "requisitos",
            "educacao_minima",
            "empresa",
            "contagem_candidatos",
            "criado_em",
            "atualizado_em",
        ]
        read_only_fields = ["empresa", "empresa_email", "contagem_candidatos", "criado_em", "atualizado_em"]

    def validate_nome(self, valor):
        if not valor.strip():
            raise serializers.ValidationError("O nome da vaga é obrigatório.")
        return valor

    def validate_requisitos(self, valor):
        if not valor.strip():
            raise serializers.ValidationError("Os requisitos são obrigatórios.")
        return valor

    def create(self, validated_data):
        user = self.context["request"].user

        if user.tipo != TipoUsuario.EMPRESA:
            raise serializers.ValidationError("Somente empresas podem criar vagas.")
        return Trabalho.objects.create(empresa=user, **validated_data)
    
class AplicacaoSerializer(serializers.ModelSerializer):
    candidato_data = serializers.SerializerMethodField(read_only=True)
    nome_trabalho = serializers.CharField(source="trabalho.nome", read_only=True)

    class Meta:
        model = Aplicacao
        fields = [
            "id", 
            "trabalho", 
            "nome_trabalho", 
            "candidato", 
            "candidato_data", 
            "score", 
            "criado_em"
        ]
        read_only_fields = ["candidato", "score", "criado_em"]

    def get_candidato_data(self, obj):
        perfil = getattr(obj.candidato, "candidato_perfil", None)
        return {
            "id": obj.candidato.id,
            "email": obj.candidato.email,
            "salario_expectativa": perfil.salario_expectativa if perfil else None,
            "experiencia": perfil.experiencia if perfil else None,
            "nivel_educacao": perfil.nivel_educacao if perfil else None,
        }

    def validate_trabalho(self, valor):
        user = self.context["request"].user

        if user.tipo != TipoUsuario.CANDIDATO:
            raise serializers.ValidationError("Somente candidatos podem se candidatar.")
        if not hasattr(user, "candidato_perfil"):
            raise serializers.ValidationError("O candidato precisa completar o perfil antes de se candidatar.")
        if Aplicacao.objects.filter(candidato=user, trabalho=valor).exists():
            raise serializers.ValidationError("Você já se candidatou para essa vaga.")
        return valor

    def create(self, validated_data):
        return Aplicacao.objects.create(candidato=self.context["request"].user, **validated_data)
