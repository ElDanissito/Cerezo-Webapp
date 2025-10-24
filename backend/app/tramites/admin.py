# Register your models here.
from django.contrib import admin
from .models import Tramite

@admin.register(Tramite)
class TramiteAdmin(admin.ModelAdmin):
    list_display = ("radicado", "solicitante", "estado", "pago_realizado", "actualizado")
    list_filter = ("estado", "pago_realizado")
    search_fields = ("radicado", "solicitante")
    ordering = ("-actualizado",)