from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
import time


class AdminPermissionTests(TestCase):
    # Genera un token JWT para un usuario
    def get_token(self, user):
        return str(RefreshToken.for_user(user).access_token)

    # Verifica que un usuario administrador tenga acceso permitido
    def test_admin_access_granted(self):
        user = User.objects.create_user(username='admin', password='pass', email='admin@example.com')
        user.is_staff = True
        user.save()

        token = self.get_token(user)
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        url = '/api/auth/admin-only/'
        resp = client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    # Verifica que un usuario normal no tenga acceso al endpoint restringido
    def test_non_admin_forbidden(self):
        user = User.objects.create_user(username='user', password='pass', email='user@example.com')
        user.is_staff = False
        user.save()

        token = self.get_token(user)
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        url = '/api/auth/admin-only/'
        resp = client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

    # Verifica que sin token se rechace la solicitud con 401
    def test_no_token_unauthorized(self):
        client = APIClient()
        url = '/api/auth/admin-only/'
        resp = client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    # Mide el rendimiento promedio y máximo de generación de tokens
    def test_token_generation_performance(self):
        import statistics

        user = User.objects.create_user(username='perfuser', password='pass', email='perf@example.com')

        times = []
        for _ in range(100):  # Ejecuta 100 iteraciones para medir rendimiento
            start = time.perf_counter()
            _ = self.get_token(user)
            times.append(time.perf_counter() - start)

        avg = statistics.mean(times)
        max_time = max(times)

        print(f"\nPromedio: {avg:.5f}s | Máximo: {max_time:.5f}s")

        # Comprueba que los tiempos estén dentro de límites razonables
        self.assertLess(avg, 0.1, f"Token generation too slow on average: {avg:.3f}s")
        self.assertLess(max_time, 0.3, f"Token generation spike too high: {max_time:.3f}s")
