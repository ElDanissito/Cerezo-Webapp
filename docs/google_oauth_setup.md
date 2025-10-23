# Configuración de Google OAuth 2.0

## Pasos para obtener las credenciales de Google OAuth

1. **Ir a Google Cloud Console**
   - Visita: https://console.cloud.google.com/

2. **Crear o seleccionar un proyecto**
   - Haz clic en el selector de proyectos en la parte superior
   - Haz clic en "Nuevo proyecto"
   - Dale un nombre (ej: "Cerezo Webapp")
   - Haz clic en "Crear"

3. **Habilitar la API de Google+**
   - Ve a "APIs y servicios" > "Biblioteca"
   - Busca "Google+ API"
   - Haz clic en "Habilitar"

4. **Configurar la pantalla de consentimiento de OAuth**
   - Ve a "APIs y servicios" > "Pantalla de consentimiento de OAuth"
   - Selecciona "Externo" (para testing) o "Interno" (si tienes Google Workspace)
   - Haz clic en "Crear"
   - Completa la información requerida:
     - Nombre de la aplicación: "Cerezo Webapp"
     - Correo electrónico de asistencia al usuario
     - Dominios autorizados: localhost (para desarrollo)
   - Haz clic en "Guardar y continuar"
   - En "Permisos", agrega los alcances:
     - `openid`
     - `email`
     - `profile`
   - Guarda y continúa

5. **Crear credenciales OAuth 2.0**
   - Ve a "APIs y servicios" > "Credenciales"
   - Haz clic en "+ CREAR CREDENCIALES" > "ID de cliente de OAuth"
   - Tipo de aplicación: "Aplicación web"
   - Nombre: "Cerezo Webapp Client"
   - URIs de redirección autorizados:
     - `http://localhost:8000/api/auth/google/callback`
     - `http://127.0.0.1:8000/api/auth/google/callback`
   - Orígenes de JavaScript autorizados:
     - `http://localhost:3000`
     - `http://localhost:8000`
   - Haz clic en "Crear"

6. **Copiar las credenciales**
   - Copia el "ID de cliente" (Client ID)
   - Copia el "Secreto de cliente" (Client Secret)

7. **Configurar el archivo .env**
   - Abre el archivo `backend/.env`
   - Reemplaza `your-google-client-id-here` con tu Client ID
   - Reemplaza `your-google-client-secret-here` con tu Client Secret

```env
GOOGLE_OAUTH_CLIENT_ID=123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
GOOGLE_OAUTH_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:8000/api/auth/google/callback
```

8. **Agregar usuarios de prueba (modo externo)**
   - Si configuraste la aplicación como "Externo", ve a "Pantalla de consentimiento de OAuth"
   - En la sección "Usuarios de prueba", haz clic en "+ AGREGAR USUARIOS"
   - Agrega los correos electrónicos que usarás para probar

## Flujo de autenticación

### Sign In
1. Usuario hace clic en "Iniciar sesión con Google" en el frontend
2. Frontend redirige a: `http://localhost:8000/api/auth/google/signin/`
3. Backend redirige a Google para autorización
4. Usuario autoriza en Google
5. Google redirige a: `http://localhost:8000/api/auth/google/callback/?code=...&state=signin`
6. Backend intercambia el código por tokens de Google
7. Backend verifica el ID token
8. Backend busca o crea el usuario en la base de datos
9. Backend genera tokens JWT
10. Backend redirige al frontend: `http://localhost:3000/dashboard?access_token=...&refresh_token=...&user_id=...`

### Sign Up
Similar al Sign In, pero con `state=signup` y redirección a `/welcome`

## Endpoints disponibles

- `GET /api/auth/google/signin/` - Inicia el flujo de Sign In con Google
- `GET /api/auth/google/signup/` - Inicia el flujo de Sign Up con Google
- `GET /api/auth/google/callback/` - Callback de Google OAuth
- `POST /api/auth/google/verify/` - Verifica un token de Google directamente
- `POST /api/auth/token/` - Obtiene un par de tokens JWT (username/password)
- `POST /api/auth/token/refresh/` - Refresca un token JWT

## Probar la autenticación

1. Inicia el backend:
```bash
cd backend
python manage.py runserver
```

2. Inicia el frontend:
```bash
cd template-frontend
npm run dev
```

3. Visita: http://localhost:3000/signin
4. Haz clic en "Iniciar sesión con Google"
5. Autoriza con tu cuenta de Google (debe estar en la lista de usuarios de prueba)
6. Deberías ser redirigido al dashboard con los tokens en la URL

## Manejo de tokens en el frontend

El frontend recibirá los tokens en la URL después de la autenticación exitosa:

```typescript
// Extraer tokens de la URL
const params = new URLSearchParams(window.location.search);
const accessToken = params.get('access_token');
const refreshToken = params.get('refresh_token');
const userId = params.get('user_id');
const email = params.get('email');

// Guardar en localStorage
localStorage.setItem('access_token', accessToken);
localStorage.setItem('refresh_token', refreshToken);
localStorage.setItem('user', JSON.stringify({ id: userId, email }));

// Limpiar la URL
window.history.replaceState({}, document.title, window.location.pathname);
```

## Uso de tokens en peticiones

```typescript
// Hacer peticiones autenticadas
const response = await fetch('http://localhost:8000/api/some-endpoint/', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
    'Content-Type': 'application/json',
  },
});
```

## Refrescar tokens

```typescript
// Cuando el access token expire (60 minutos)
const refreshToken = localStorage.getItem('refresh_token');
const response = await fetch('http://localhost:8000/api/auth/token/refresh/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ refresh: refreshToken }),
});

const data = await response.json();
localStorage.setItem('access_token', data.access);
```
