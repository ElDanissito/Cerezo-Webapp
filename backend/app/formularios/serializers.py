from rest_framework import serializers
from .models import FormDefinition, FormVersion, FormField


class FormVersionBriefSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormVersion
        fields = ("id", "version", "is_published", "created_at")


class FormDefinitionListSerializer(serializers.ModelSerializer):
    tramite = serializers.StringRelatedField()
    active_version = FormVersionBriefSerializer(read_only=True)

    class Meta:
        model = FormDefinition
        fields = (
            "id",
            "name",
            "tramite",
            "description",
            "active_version",
            "updated_at",
        )


class FormFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormField
        fields = (
            "id",
            "name",
            "label",
            "type",
            "help_text",
            "required",
            "order",
            "validations",
            "options",
        )


class FormVersionDetailSerializer(serializers.ModelSerializer):
    fields = FormFieldSerializer(many=True, read_only=True)

    class Meta:
        model = FormVersion
        fields = (
            "id",
            "version",
            "is_published",
            "changelog",
            "created_at",
            "fields",
        )


class FormDefinitionDetailSerializer(serializers.ModelSerializer):
    tramite = serializers.StringRelatedField()
    active_version = FormVersionBriefSerializer(read_only=True)
    versions = FormVersionDetailSerializer(many=True, read_only=True)

    class Meta:
        model = FormDefinition
        fields = (
            "id",
            "name",
            "tramite",
            "description",
            "active_version",
            "versions",
            "created_at",
            "updated_at",
        )


class FormDefinitionCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer para crear/actualizar definiciones de formulario.

    Requiere name y tramite. active_version es opcional y debe pertenecer al mismo form si se establece
    (esa validacion mas estricta se puede agregar si se necesita).
    """

    class Meta:
        model = FormDefinition
        fields = (
            "name",
            "tramite",
            "description",
            "active_version",
        )
        extra_kwargs = {
            "name": {"required": True},
            "tramite": {"required": True},
        }
