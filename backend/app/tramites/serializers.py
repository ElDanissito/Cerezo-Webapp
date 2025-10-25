from rest_framework import serializers
from .models import Tramite


class TramiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tramite
        fields = ['id', 'titulo', 'descripcion', 'tipo', 'clicks', 'created_at']
