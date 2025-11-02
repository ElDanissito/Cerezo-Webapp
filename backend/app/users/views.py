from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from django.conf import settings
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import redirect
from urllib.parse import urlencode
import requests


def get_tokens_for_user(user):
	"""Genera tokens JWT para un usuario"""
	refresh = RefreshToken.for_user(user)
	return {
		'access_token': str(refresh.access_token),
		'refresh_token': str(refresh),
	}


@api_view(['GET'])
@permission_classes([AllowAny])
def google_signin(request):
	"""Inicia el flujo de OAuth de Google para Sign In"""
	# URL de autorización de Google
	google_auth_url = 'https://accounts.google.com/o/oauth2/v2/auth'
    
	params = {
		'client_id': settings.GOOGLE_OAUTH_CLIENT_ID,
		'redirect_uri': settings.GOOGLE_OAUTH_REDIRECT_URI,
		'response_type': 'code',
		'scope': 'openid email profile',
		'access_type': 'offline',
		'prompt': 'consent',
		'state': 'signin',  # Para identificar si es signin o signup
	}
    
	auth_url = f"{google_auth_url}?{urlencode(params)}"
	return redirect(auth_url)


@api_view(['GET'])
@permission_classes([AllowAny])
def google_signup(request):
	"""Inicia el flujo de OAuth de Google para Sign Up"""
	# URL de autorización de Google
	google_auth_url = 'https://accounts.google.com/o/oauth2/v2/auth'
    
	params = {
		'client_id': settings.GOOGLE_OAUTH_CLIENT_ID,
		'redirect_uri': settings.GOOGLE_OAUTH_REDIRECT_URI,
		'response_type': 'code',
		'scope': 'openid email profile',
		'access_type': 'offline',
		'prompt': 'consent',
		'state': 'signup',  # Para identificar si es signin o signup
	}
    
	auth_url = f"{google_auth_url}?{urlencode(params)}"
	return redirect(auth_url)


@api_view(['GET'])
@permission_classes([AllowAny])
def google_callback(request):
	"""Callback de Google OAuth"""
	code = request.GET.get('code')
	state = request.GET.get('state', 'signin')
	error = request.GET.get('error')
    
	# Si hay error, redirigir al frontend con el error
	if error:
		frontend_url = f"{settings.FRONTEND_URL}/signin?error={error}"
		return redirect(frontend_url)
    
	if not code:
		frontend_url = f"{settings.FRONTEND_URL}/signin?error=no_code"
		return redirect(frontend_url)
    
	try:
		# Intercambiar el código por tokens
		token_url = 'https://oauth2.googleapis.com/token'
		token_data = {
			'code': code,
			'client_id': settings.GOOGLE_OAUTH_CLIENT_ID,
			'client_secret': settings.GOOGLE_OAUTH_CLIENT_SECRET,
			'redirect_uri': settings.GOOGLE_OAUTH_REDIRECT_URI,
			'grant_type': 'authorization_code',
		}
        
		token_response = requests.post(token_url, data=token_data)
		token_response.raise_for_status()
		tokens = token_response.json()
        
		# Verificar el ID token
		id_info = id_token.verify_oauth2_token(
			tokens['id_token'],
			google_requests.Request(),
			settings.GOOGLE_OAUTH_CLIENT_ID
		)
        
		# Obtener información del usuario
		email = id_info.get('email')
		first_name = id_info.get('given_name', '')
		last_name = id_info.get('family_name', '')
		google_id = id_info.get('sub')
        
		if not email:
			frontend_url = f"{settings.FRONTEND_URL}/signin?error=no_email"
			return redirect(frontend_url)
        
		# Buscar o crear el usuario
		user, created = User.objects.get_or_create(
			email=email,
			defaults={
				'username': email,
				'first_name': first_name,
				'last_name': last_name,
			}
		)
        
		# Si el usuario ya existía y es signup, actualizar datos
		if not created and state == 'signup':
			user.first_name = first_name
			user.last_name = last_name
			user.save()
        
		# Generar tokens JWT
		jwt_tokens = get_tokens_for_user(user)
        
		# Redirigir al frontend con los tokens
		params = {
			'access_token': jwt_tokens['access_token'],
			'refresh_token': jwt_tokens['refresh_token'],
			'user_id': user.id,
			'email': user.email,
			'first_name': user.first_name,
			'last_name': user.last_name,
		}
        
		# Redirigir siempre al dashboard, tanto para signin como signup
		frontend_url = f"{settings.FRONTEND_URL}/dashboard?{urlencode(params)}"
		return redirect(frontend_url)
        
	except Exception as e:
		print(f"Error en Google OAuth: {str(e)}")
		frontend_url = f"{settings.FRONTEND_URL}/signin?error=auth_failed"
		return redirect(frontend_url)


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_google_token(request):
	"""Verifica un token de Google directamente desde el frontend"""
	token = request.data.get('token')
    
	if not token:
		return Response(
			{'error': 'Token no proporcionado'},
			status=status.HTTP_400_BAD_REQUEST
		)
    
	try:
		# Verificar el token
		id_info = id_token.verify_oauth2_token(
			token,
			google_requests.Request(),
			settings.GOOGLE_OAUTH_CLIENT_ID
		)
        
		# Obtener información del usuario
		email = id_info.get('email')
		first_name = id_info.get('given_name', '')
		last_name = id_info.get('family_name', '')
        
		if not email:
			return Response(
				{'error': 'Email no encontrado en el token'},
				status=status.HTTP_400_BAD_REQUEST
			)
        
		# Buscar o crear el usuario
		user, created = User.objects.get_or_create(
			email=email,
			defaults={
				'username': email,
				'first_name': first_name,
				'last_name': last_name,
			}
		)
        
		# Generar tokens JWT
		jwt_tokens = get_tokens_for_user(user)
        
		return Response({
			'access_token': jwt_tokens['access_token'],
			'refresh_token': jwt_tokens['refresh_token'],
			'user': {
				'id': user.id,
				'email': user.email,
				'first_name': user.first_name,
				'last_name': user.last_name,
				'username': user.username,
			}
		}, status=status.HTTP_200_OK)
        
	except Exception as e:
		return Response(
			{'error': f'Error al verificar el token: {str(e)}'},
			status=status.HTTP_400_BAD_REQUEST
		)
