from rest_framework import generics, filters
from rest_framework.permissions import AllowAny
from .models import FormDefinition
from .serializers import (
	FormDefinitionListSerializer,
	FormDefinitionDetailSerializer,
	FormDefinitionCreateUpdateSerializer,
)


class FormDefinitionListView(generics.ListCreateAPIView):
	"""GET /api/formularios

	Listado de definiciones de formularios con soporte de busqueda por nombre
	via query param ?search=<texto>. Usa filtro icontains sobre name.
	"""

	queryset = FormDefinition.objects.select_related("tramite", "active_version").all()
	serializer_class = FormDefinitionListSerializer
	# Use default ADMIN-only permission from settings
	filter_backends = [filters.SearchFilter]
	search_fields = ["name"]

	def get_serializer_class(self):  # type: ignore[override]
		if self.request and self.request.method == "POST":
			return FormDefinitionCreateUpdateSerializer
		return FormDefinitionListSerializer


class FormDefinitionDetailView(generics.RetrieveUpdateAPIView):
	"""GET /api/formularios/{id}

	Devuelve la definicion completa del formulario, incluyendo todas sus
	versiones y sus campos.
	"""

	queryset = (
		FormDefinition.objects.select_related("tramite", "active_version")
		.prefetch_related("versions__fields")
		.all()
	)
	serializer_class = FormDefinitionDetailSerializer
	# Use default ADMIN-only permission from settings

	def get_serializer_class(self):  # type: ignore[override]
		if self.request and self.request.method in {"PUT", "PATCH"}:
			return FormDefinitionCreateUpdateSerializer
		return FormDefinitionDetailSerializer
