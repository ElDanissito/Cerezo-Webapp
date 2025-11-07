# app/tramites/views.py
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
import time

from django.conf import settings
from django.utils.dateparse import parse_date
from django.db.models import Count, Q
from django.db.models.functions import TruncMonth

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

# Intenta usar el modelo real; si no existe, seguimos con MOCK
try:
    from .models import Tramite
    HAS_MODEL = True
except Exception:
    Tramite = None  # type: ignore
    HAS_MODEL = False

# Flag para forzar MOCK desde settings (por defecto True para que funcione sin BD)
DASHBOARD_USE_MOCK = getattr(settings, "DASHBOARD_USE_MOCK", True)

# Etiquetas para meses (Ene..Dic)
MESES_ES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun",
            "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]


# ---------- Helpers ----------
def _mock_summary():
    """Payload de ejemplo que calza con lo que consume el frontend (incluye series)."""
    return {
        "total": 12446,
        "enProceso": 312,
        "completados": 11840,
        "pagosRealizados": 10420,
        "variacion": {
            "total": 3.2,
            "enProceso": -1.1,
            "completados": 4.8,
            "pagosRealizados": 2.4,
        },
        "actualizadoEn": datetime.now(ZoneInfo(getattr(settings, "TIME_ZONE", "UTC"))).isoformat(),
        "recientes": [
            {"id": "TR-2025-0001", "solicitante": "María Pérez", "estado": "En proceso", "pago": "No realizado", "actualizado": "2025-10-19T15:25:00.000Z"},
            {"id": "TR-2025-0002", "solicitante": "Juan Carlos",  "estado": "Completado", "pago": "Realizado",   "actualizado": "2025-10-18T09:10:00.000Z"},
            {"id": "TR-2025-0003", "solicitante": "Ana Ruiz",     "estado": "Completado", "pago": "Realizado",   "actualizado": "2025-10-17T16:45:00.000Z"},
            {"id": "TR-2025-0004", "solicitante": "Carlos Díaz",  "estado": "Pendiente",  "pago": "No realizado","actualizado": "2025-10-16T11:30:00.000Z"},
        ],
        "series": {
            "meses": MESES_ES,
            "enProceso":   [260, 240, 280, 270, 300, 320, 290, 310, 305, 295, 315, 330],
            "completados": [820, 760, 910, 880, 940, 970, 930, 990, 1010, 980, 1050, 1100],
            "pagos":       [700, 680, 820, 790, 860, 890, 870, 920, 940, 910, 960, 1000],
            "year": datetime.now().year,
        },
    }


def _parse_range(request):
    """
    Devuelve (start_dt, end_dt, tz) válidos para KPIs/recientes.
    Por defecto: últimos 30 días en TIME_ZONE.
    """
    tz_str = request.query_params.get("tz") or getattr(settings, "TIME_ZONE", "UTC")
    try:
        tz = ZoneInfo(tz_str)
    except Exception:
        tz = ZoneInfo(getattr(settings, "TIME_ZONE", "UTC"))

    to_str = request.query_params.get("to")
    fr_str = request.query_params.get("from")
    now_tz = datetime.now(tz)

    if to_str:
        try:
            d = parse_date(to_str)
            end_dt = datetime(d.year, d.month, d.day, 23, 59, 59, tzinfo=tz)
        except Exception:
            end_dt = now_tz
    else:
        end_dt = now_tz

    if fr_str:
        try:
            d = parse_date(fr_str)
            start_dt = datetime(d.year, d.month, d.day, 0, 0, 0, tzinfo=tz)
        except Exception:
            start_dt = end_dt - timedelta(days=30)
    else:
        start_dt = end_dt - timedelta(days=30)

    if start_dt > end_dt:
        start_dt, end_dt = end_dt - timedelta(days=30), end_dt

    return start_dt, end_dt, tz


def _percent_change(curr: int, prev: int) -> float:
    if prev == 0:
        return 0.0 if curr == 0 else 100.0
    return round(((curr - prev) / prev) * 100.0, 1)


def _year_bounds(year: int, tz):
    start = datetime(year, 1, 1, 0, 0, 0, tzinfo=tz)
    end = datetime(year, 12, 31, 23, 59, 59, tzinfo=tz)
    return start, end


# ---------- Vista ----------
class DashboardSummaryView(APIView):
    """
    GET /api/dashboard/summary
      ?from=YYYY-MM-DD
      &to=YYYY-MM-DD
      &tz=America/Bogota
      &limit=10
      &year=2025

    - KPIs y recientes: se calculan sobre el rango [from..to] (por defecto, últimos 30 días).
    - Series mensuales (para gráficos): se calculan para el 'year' indicado (por defecto, año del end_dt).
    """
    authentication_classes = []           # público aunque defaults pidan auth
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        t0 = time.perf_counter()

        # saneamos limit (1..100)
        try:
            limit = int(request.query_params.get("limit") or 10)
        except Exception:
            limit = 10
        limit = max(1, min(limit, 100))

        # MOCK si no hay modelo o si el flag lo fuerza
        if DASHBOARD_USE_MOCK or not HAS_MODEL:
            resp = Response(_mock_summary(), headers={"x-data-source": "mock"})
            resp["x-gen-ms"] = f"{(time.perf_counter()-t0)*1000:.0f}"
            return resp

        # ----- Rango y año -----
        start_dt, end_dt, tz = _parse_range(request)
        try:
            year = int(request.query_params.get("year") or end_dt.year)
        except Exception:
            year = end_dt.year

        # ----- KPIs (agregados en 1 query) -----
        qs = Tramite.objects.filter(actualizado__gte=start_dt, actualizado__lte=end_dt)

        agg = qs.aggregate(
            total=Count("id"),
            en_proceso=Count("id", filter=Q(estado=Tramite.Estado.EN_PROCESO)),
            completados=Count("id", filter=Q(estado=Tramite.Estado.COMPLETADO)),
            pagos_realizados=Count("id", filter=Q(pago_realizado=True)),
        )
        total = agg["total"] or 0
        en_proceso = agg["en_proceso"] or 0
        completados = agg["completados"] or 0
        pagos_realizados = agg["pagos_realizados"] or 0

        # ----- Periodo anterior (misma longitud) -----
        delta = end_dt - start_dt
        prev_start = (start_dt - delta) - timedelta(seconds=1)
        prev_end = (start_dt - timedelta(seconds=1))

        prev_qs = Tramite.objects.filter(actualizado__gte=prev_start, actualizado__lte=prev_end)
        prev = prev_qs.aggregate(
            total=Count("id"),
            en_proceso=Count("id", filter=Q(estado=Tramite.Estado.EN_PROCESO)),
            completados=Count("id", filter=Q(estado=Tramite.Estado.COMPLETADO)),
            pagos_realizados=Count("id", filter=Q(pago_realizado=True)),
        )

        # ----- Recientes (solo columnas necesarias) -----
        from rest_framework import serializers

        class TramiteRecentSerializer(serializers.Serializer):
            id = serializers.SerializerMethodField()
            solicitante = serializers.CharField()
            estado = serializers.SerializerMethodField()
            pago = serializers.SerializerMethodField()
            actualizado = serializers.DateTimeField()

            def get_id(self, obj):
                # Usa "radicado" si existe; si no, pk
                return getattr(obj, "radicado", str(getattr(obj, "pk", "")))

            def get_estado(self, obj):
                label = {
                    Tramite.Estado.EN_PROCESO: "En proceso",
                    Tramite.Estado.COMPLETADO: "Completado",
                    Tramite.Estado.PENDIENTE: "Pendiente",
                }
                return label.get(getattr(obj, "estado", Tramite.Estado.PENDIENTE), "Pendiente")

            def get_pago(self, obj):
                return "Realizado" if getattr(obj, "pago_realizado", False) else "No realizado"

            def to_representation(self, instance):
                data = super().to_representation(instance)
                if hasattr(instance, "actualizado") and data.get("actualizado"):
                    try:
                        data["actualizado"] = instance.actualizado.astimezone().isoformat()
                    except Exception:
                        pass
                return data

        recientes_qs = (
            qs.order_by("-actualizado")
              .only("radicado", "solicitante", "estado", "pago_realizado", "actualizado")[:limit]
        )
        recientes = TramiteRecentSerializer(recientes_qs, many=True).data

        # ----- Series mensuales (por año, independiente del rango KPIs) -----
        year_start, year_end = _year_bounds(year, tz)
        qs_year = Tramite.objects.filter(actualizado__gte=year_start, actualizado__lte=year_end)

        monthly = (
            qs_year
            .annotate(m=TruncMonth("actualizado", tzinfo=tz))
            .values("m")
            .annotate(
                en_proceso=Count("id", filter=Q(estado=Tramite.Estado.EN_PROCESO)),
                completados=Count("id", filter=Q(estado=Tramite.Estado.COMPLETADO)),
                pagos=Count("id", filter=Q(pago_realizado=True)),
            )
            .order_by("m")
        )

        series = {
            "meses": MESES_ES,
            "enProceso":   [0] * 12,
            "completados": [0] * 12,
            "pagos":       [0] * 12,
            "year": year,
        }
        for row in monthly:
            idx = row["m"].month - 1  # 0..11
            series["enProceso"][idx]   = row["en_proceso"] or 0
            series["completados"][idx] = row["completados"] or 0
            series["pagos"][idx]       = row["pagos"] or 0

        # ----- Payload final -----
        payload = {
            "total": total,
            "enProceso": en_proceso,
            "completados": completados,
            "pagosRealizados": pagos_realizados,
            "variacion": {
                "total": _percent_change(total, prev["total"] or 0),
                "enProceso": _percent_change(en_proceso, prev["en_proceso"] or 0),
                "completados": _percent_change(completados, prev["completados"] or 0),
                "pagosRealizados": _percent_change(pagos_realizados, prev["pagos_realizados"] or 0),
            },
            "actualizadoEn": datetime.now(tz).isoformat(),
            "recientes": recientes,
            "series": series,
        }

        resp = Response(payload, headers={"x-data-source": "db"})
        resp["x-gen-ms"] = f"{(time.perf_counter()-t0)*1000:.0f}"
        # (opcional) cache corto en cliente:
        # resp["Cache-Control"] = "max-age=10, public"
        return resp
