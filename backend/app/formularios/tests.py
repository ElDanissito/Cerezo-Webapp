from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status

from app.tramites.models import TramiteType, Tramite
from .models import FormDefinition, FormVersion, FormField, FormFieldType
from django.contrib.auth import get_user_model


class FormulariosApiTests(TestCase):
	def setUp(self):
		self.client = APIClient()
		# Crear usuario admin para pasar permiso AdminOnly
		User = get_user_model()
		self.admin = User.objects.create_user(
			username="admin", email="admin@example.com", password="adminpass", is_staff=True
		)

		# Datos base: tipo y tramite
		self.tipo = TramiteType.objects.create(name="Documentos", slug="documentos")
		self.tramite = Tramite.objects.create(title="Solicitud de certificado", slug="solicitud-certificado", tipo=self.tipo)

		self.base_url = "/api/formularios/"

	def auth(self):
		self.client.force_authenticate(user=self.admin)

	def test_requires_admin_auth(self):
		# Sin autenticacion → 401
		res = self.client.get(self.base_url)
		self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

	def test_create_formdefinition_requires_fields_returns_422(self):
		self.auth()
		res = self.client.post(self.base_url, data={}, format="json")
		self.assertEqual(res.status_code, 422)
		self.assertIn("errors", res.data)
		self.assertIn("name", res.data["errors"])  # campo requerido
		self.assertIn("tramite", res.data["errors"])  # campo requerido

	def test_create_formdefinition_success(self):
		self.auth()
		payload = {"name": "Formulario Certificado", "tramite": self.tramite.id, "description": "Definicion base"}
		res = self.client.post(self.base_url, data=payload, format="json")
		self.assertEqual(res.status_code, status.HTTP_201_CREATED)
		self.assertTrue(FormDefinition.objects.filter(name="Formulario Certificado", tramite=self.tramite).exists())

	def test_update_requires_fields_on_put_returns_422(self):
		self.auth()
		fdef = FormDefinition.objects.create(name="Form A", tramite=self.tramite)
		url = f"{self.base_url}{fdef.id}/"
		# PUT sin campos requeridos
		res = self.client.put(url, data={}, format="json")
		self.assertEqual(res.status_code, 422)
		self.assertIn("errors", res.data)

	def test_patch_allows_partial_update(self):
		self.auth()
		fdef = FormDefinition.objects.create(name="Form A", tramite=self.tramite, description="v0")
		url = f"{self.base_url}{fdef.id}/"
		res = self.client.patch(url, data={"description": "v1"}, format="json")
		self.assertEqual(res.status_code, status.HTTP_200_OK)
		fdef.refresh_from_db()
		self.assertEqual(fdef.description, "v1")

	def test_detail_includes_versions_and_fields(self):
		self.auth()
		fdef = FormDefinition.objects.create(name="Form A", tramite=self.tramite)
		v1 = FormVersion.objects.create(form=fdef, version=1, is_published=True, changelog="init")
		FormField.objects.create(
			form_version=v1,
			order=1,
			name="nombres",
			label="Nombres",
			type=FormFieldType.TEXT,
			required=True,
			validations={"minLength": 2},
		)
		fdef.active_version = v1
		fdef.save()

		url = f"{self.base_url}{fdef.id}/"
		res = self.client.get(url)
		self.assertEqual(res.status_code, status.HTTP_200_OK)
		self.assertIn("versions", res.data)
		self.assertTrue(len(res.data["versions"]) >= 1)
		self.assertTrue(len(res.data["versions"][0]["fields"]) >= 1)

	def test_non_admin_forbidden(self):
		# Usuario autenticado pero no admin -> 403
		User = get_user_model()
		user = User.objects.create_user(username="user", email="user@example.com", password="userpass", is_staff=False)
		self.client.force_authenticate(user=user)
		res = self.client.get(self.base_url)
		self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

	def test_list_includes_active_version_brief(self):
		self.auth()
		fdef = FormDefinition.objects.create(name="Form B", tramite=self.tramite)
		v1 = FormVersion.objects.create(form=fdef, version=1, is_published=True)
		fdef.active_version = v1
		fdef.save()
		res = self.client.get(self.base_url)
		self.assertEqual(res.status_code, status.HTTP_200_OK)
		# Buscar el registro por id y verificar active_version
		match = [item for item in res.data if item["id"] == fdef.id]
		self.assertTrue(match)
		self.assertIn("active_version", match[0])
		self.assertEqual(match[0]["active_version"]["version"], 1)

	def test_search_by_name_filters_results(self):
		self.auth()
		FormDefinition.objects.create(name="Permiso de conduccion", tramite=self.tramite)
		FormDefinition.objects.create(name="Solicitud de pasaporte", tramite=self.tramite)
		res = self.client.get(self.base_url + "?search=pasaporte")
		self.assertEqual(res.status_code, status.HTTP_200_OK)
		names = {item["name"] for item in res.data}
		self.assertIn("Solicitud de pasaporte", names)
		self.assertNotIn("Permiso de conduccion", names)

	def test_create_with_invalid_tramite_returns_422(self):
		self.auth()
		payload = {"name": "X", "tramite": 999999}
		res = self.client.post(self.base_url, data=payload, format="json")
		self.assertEqual(res.status_code, 422)
		self.assertIn("tramite", res.data.get("errors", {}))

	def test_delete_not_allowed_returns_405(self):
		self.auth()
		fdef = FormDefinition.objects.create(name="Form Del", tramite=self.tramite)
		url = f"{self.base_url}{fdef.id}/"
		res = self.client.delete(url)
		self.assertEqual(res.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

	def test_patch_blank_name_returns_422(self):
		self.auth()
		fdef = FormDefinition.objects.create(name="Form C", tramite=self.tramite)
		url = f"{self.base_url}{fdef.id}/"
		res = self.client.patch(url, data={"name": ""}, format="json")
		self.assertEqual(res.status_code, 422)
		self.assertIn("name", res.data.get("errors", {}))

	def test_detail_not_found_returns_404(self):
		self.auth()
		res = self.client.get(self.base_url + "999999/")
		self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

# Create your tests here.
