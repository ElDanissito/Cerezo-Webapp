from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
import json


@api_view(['GET', 'POST', 'PUT', 'PATCH'])
@permission_classes([AllowAny])
def test_sanitize(request):
	"""Endpoint de prueba para inspeccionar los datos recibidos por el servidor.

	Devuelve una representación de:
	- request.GET
	- request.POST
	- request.body (raw)
	- request.data (DRF-parsed)

	Útil para comprobar el efecto del middleware `SanitizeInputMiddleware`.
	"""
	try:
		raw_body = request.body.decode('utf-8') if request.body else ''
	except Exception:
		raw_body = str(request.body)

	# Intentar parsear JSON raw por si request.data no está disponible
	parsed_body = None
	try:
		if raw_body:
			parsed_body = json.loads(raw_body)
	except Exception:
		parsed_body = None

	data = {
		'method': request.method,
		'GET': {k: request.GET.getlist(k) if len(request.GET.getlist(k))>1 else request.GET.get(k) for k in request.GET.keys()},
		'POST': {k: request.POST.getlist(k) if len(request.POST.getlist(k))>1 else request.POST.get(k) for k in request.POST.keys()},
		'raw_body': raw_body,
		'parsed_body_from_raw': parsed_body,
		'request_data': request.data,
	}

	return Response(data, status=status.HTTP_200_OK)
