from django.db import models

class Tramite(models.Model):
    class Estado(models.TextChoices):
        EN_PROCESO = "EN_PROCESO", "En proceso"
        COMPLETADO = "COMPLETADO", "Completado"
        PENDIENTE = "PENDIENTE", "Pendiente"

    radicado = models.CharField(max_length=50, unique=True)
    solicitante = models.CharField(max_length=150)
    estado = models.CharField(max_length=20, choices=Estado.choices, default=Estado.PENDIENTE)
    pago_realizado = models.BooleanField(default=False)
    actualizado = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-actualizado"]
        indexes = [
            models.Index(fields=["actualizado"], name="tramite_actualizado_idx"),
            models.Index(fields=["estado"], name="tramite_estado_idx"),
            models.Index(fields=["pago_realizado"], name="tramite_pago_idx"),
        ]

    def __str__(self) -> str:
        return f"{self.radicado} - {self.solicitante}"