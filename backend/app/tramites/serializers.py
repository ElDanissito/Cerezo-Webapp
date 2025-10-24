
from rest_framework import serializers
from .models import Tramite

ESTADO_LABEL = {
    "EN_PROCESO": "En proceso",
    "COMPLETADO": "Completado",
    "PENDIENTE": "Pendiente",
}

class TramiteRecentSerializer(serializers.Serializer):
    id = serializers.SerializerMethodField()
    solicitante = serializers.CharField()
    estado = serializers.SerializerMethodField()
    pago = serializers.SerializerMethodField()
    actualizado = serializers.DateTimeField()

    def get_id(self, obj):
        return getattr(obj, "radicado", str(getattr(obj, "pk", "")))

    def get_estado(self, obj):
        code = getattr(obj, "estado", "PENDIENTE")
        return ESTADO_LABEL.get(code, "Pendiente")

    def get_pago(self, obj):
        return "Realizado" if getattr(obj, "pago_realizado", False) else "No realizado"

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if hasattr(instance, "actualizado") and data.get("actualizado"):
            dt = instance.actualizado
            try:
                data["actualizado"] = dt.astimezone().isoformat()
            except Exception:
                pass
        return data