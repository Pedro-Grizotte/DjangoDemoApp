from rest_framework import serializers
from contas.models import Usuario, TipoUsuario
from .models import Trabalho, Aplicacao, PerfilCandidatos, RangeSalarios, NivelEducacao

# Validações principais
class CandidatoPerfilSerializer(serializers.ModelSerializer):
    class Meta:
        model = PerfilCandidatos
        campos = ["salario_expectativa", "experiencia", "nivel_educacao"]

    def validar_expectativa_salarial(self, valor):
        if valor < 0:
            raise serializers.ValidationError("A pretensão salarial deve ser maior ou igual a zero.")
        return valor
    
class UsuarioRegistroSerializer(serializers.ModelSerializer):
    senha = serializers.CharField(write_only=True, min_lenght=6)
    candidato_perfil = CandidatoPerfilSerializer(required=False)

    class Meta:
        model = Usuario
        campos = ["id", "email", "senha", "tipo", "candidato_perfil"]

    def validacoes(self, atributos):
        tipo = atributos.get("tipo")
        candidato_perfil = atributos.get("candidato_perfil")

        if tipo == TipoUsuario.CANDIDATO and not candidato_perfil:
            raise serializers.ValidationError({
                "candidato_perfil": "Candidatos precisam informar pretensão salarial, experiência e escolaridade."
            })
        if tipo == TipoUsuario.EMPRESA and not candidato_perfil:
            raise serializers.ValidationError({
                "candidato_perfil": "A empresa não deve enviar perfil de candidato."
            })
        return atributos
    
    def create(self, validated_data):
        candidato_perfil_data = validated_data.pop("candidato_perfil", None)
        senha = validated_data.pop("senha")

        user = Usuario.objects.create_user(senha=senha, **validated_data)
        
        if user.tipo == TipoUsuario.CANDIDATO and candidato_perfil_data:
            PerfilCandidatos.objects.create(user=user, **candidato_perfil_data)
        return user
    
class TrabalhoSerializer(serializers.ModelSerializer):
    contagem_candidatos = serializers.IntegerField(read_only=True)

    class Meta:
        model = Trabalho
        campos = [
            "id",
            "nome",
            "range_salarios",
            "requisitos",
            "nivel_educacao",
            "empresa",
            "contagem_candidatos",
            "criado_em",
            "atualizado_em",
        ]
        read_only_fields = ["empresa", "criado_em", "atualizado_em"]

    def validar_nome(self, valor):
        if not valor.strip():
            raise serializers.ValidationError("O nome da vaga é obrigatório.")
        return valor
    
    def validar_requisitos(self, valor):
        if not valor.strip():
            raise serializers.ValidationError("Os requisitos são obrigatórios.")
        return valor
    
    def create(self, validated_data):
        request = self.context["request"]
        user = request.user

        if user.tipo != TipoUsuario.EMPRESA:
            raise serializers.ValidationError("Somente empresas podem criar vagas.")
        return Trabalho.objects.create(empresa=user, **validated_data)
    
class AplicacaoSerializer(serializers.ModelSerializer):
    candidato_data = serializers.SerializerMethodField(read_only=True)
    nome_trabalho = serializers.CharField(source="trabalho.nome", read_only=True)

    class Meta:
        model = Aplicacao
        campos = ["id", "trabalho", "nome_trabalho", "candidato", "candidato_data", "score", "criado_em"]
        read_only_fields = ["candidato", "score", "criado_em"]

    def get_candidato_data(self, obj):
        perfil = getattr(obj.candidato, "candidato_perfil", None)
        return {
            "id": obj.candidato.id,
            "eamil": obj.candidato.eamil,
            "salario_expectativa": perfil.salario_expectativa if perfil else None,
            "experiencia": perfil.experiencia if perfil else None,
            "nivel_educacao": perfil.nivel_educacao if perfil else None,
        }
    
    def validar_trabalho(self, valor):
        request = self.context["request"]
        user = request.user,

        if user.tipo != TipoUsuario.CANDIDATO:
            raise serializers.ValidationError("Somente candidatos podem se candidatar.")
        if not hasattr(user, "candidato_perfil"):
            raise serializers.ValidationError("O candidato precisa completar o perfil antes de se candidatar.")
        if Aplicacao.objects.filter(candidato=user, trabalho=valor).exists():
            raise serializers.ValidationError("Você já se candidatou para essa vaga.")
        return valor
    
    def create(self, validated_data):
        request = self.context["request"]
        return Aplicacao.objects.create(candaidato=request.user, **validated_data)