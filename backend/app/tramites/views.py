from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Tramite
from .serializers import TramiteSerializer
from django.utils import timezone
from datetime import timedelta
from django.db.models import Sum

"""Devuelve los 5 trámites más recientes ordenados por fecha de creación descendente."""
@api_view(['GET'])
@permission_classes([AllowAny])
def recent_tramites(request):
	recent = Tramite.objects.all().order_by('-created_at')[:5]
	serializer = TramiteSerializer(recent, many=True)
	return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def top_tramites_by_clicks(request):
	"""Devuelve los 5 trámites con más clicks y un desglose por tipo.

	Respuesta JSON ejemplo:
	{
	  "items": [ {tramite}, ... ],
	  "breakdown": { "catalogo": 3, "formulario": 2 }
	}
	"""
	top5 = Tramite.objects.order_by('-clicks')[:5]
	serializer = TramiteSerializer(top5, many=True)

	# Calcular desglose por tipo entre los top5
	breakdown = {
		Tramite.TIPO_CATALOGO: 0,
		Tramite.TIPO_FORMULARIO: 0,
	}
	for t in top5:
		if t.tipo in breakdown:
			breakdown[t.tipo] += 1
	return Response({
		'items': serializer.data,
		'breakdown': breakdown,
	})


@api_view(['GET'])
@permission_classes([AllowAny])
def top_tramites_by_purchases_last_7_days(request):
	"""Calcula los 5 trámites con más compras en los últimos 7 días.

	Agrupa por trámite y suma la cantidad (`quantity`) de las compras.
	Devuelve una lista con {'tramite_id', 'titulo', 'purchase_count'} ordenada desc.
	"""
	since = timezone.now() - timedelta(days=7)
	# Aggregar purchases por tramite en los últimos 7 días
	from app.pagos.models import Purchase
	qs = Purchase.objects.filter(created_at__gte=since).values('tramite').annotate(purchase_count=Sum('quantity')).order_by('-purchase_count')[:5]

	# Obtener detalles de los trámites involucrados
	tramite_ids = [item['tramite'] for item in qs]
	tramites = Tramite.objects.in_bulk(tramite_ids)

	results = []
	for item in qs:
		t = tramites.get(item['tramite'])
		results.append({
			'tramite_id': item['tramite'],
			'titulo': t.titulo if t else None,
			'purchase_count': item['purchase_count'] or 0,
		})

	return Response({'top_purchases_last_7_days': results})

