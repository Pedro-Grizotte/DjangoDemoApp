from rest_framework import serializers

from apps.contas.models import NivelEducacao, PerfilCandidatos, TipoUsuario, Usuario


class CandidatoPerfilSerializer(serializers.ModelSerializer):
    class Meta:
        model = PerfilCandidatos
        fields = ["salario_expectativa", "experiencia", "nivel_educacao"]

    def validate_salario_expectativa(self, valor):
        if valor < 0:
            raise serializers.ValidationError(
                "A pretensao salarial deve ser maior ou igual a zero."
            )
        return valor


class UsuarioRegistroSerializer(serializers.ModelSerializer):
    senha = serializers.CharField(write_only=True, min_length=6)
    candidato_perfil = CandidatoPerfilSerializer(required=False)

    class Meta:
        model = Usuario
        fields = ["id", "email", "senha", "tipo", "candidato_perfil"]

    def validate(self, attrs):
        tipo = attrs.get("tipo")
        candidato_perfil = attrs.get("candidato_perfil")

        if tipo == TipoUsuario.CANDIDATO and not candidato_perfil:
            raise serializers.ValidationError(
                {
                    "candidato_perfil": (
                        "Candidatos precisam informar pretensao salarial, experiencia e escolaridade."
                    )
                }
            )
        if tipo == TipoUsuario.EMPRESA and candidato_perfil:
            raise serializers.ValidationError(
                {"candidato_perfil": "A empresa nao deve enviar perfil de candidato."}
            )
        return attrs

    def create(self, validated_data):
        candidato_perfil_data = validated_data.pop("candidato_perfil", None)
        senha = validated_data.pop("senha")

        user = Usuario.objects.criar_usuario(senha=senha, **validated_data)

        if user.tipo == TipoUsuario.CANDIDATO and candidato_perfil_data:
            PerfilCandidatos.objects.create(user=user, **candidato_perfil_data)
        return user


class UsuarioSerializer(serializers.ModelSerializer):
    candidato_perfil = CandidatoPerfilSerializer(read_only=True)
    tipo_display = serializers.CharField(source="get_tipo_display", read_only=True)
    nivel_educacao_opcoes = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Usuario
        fields = ["id", "email", "tipo", "tipo_display", "candidato_perfil", "nivel_educacao_opcoes"]

    def get_nivel_educacao_opcoes(self, _obj):
        return [{"valor": valor, "label": label} for valor, label in NivelEducacao.choices]
