from django.db import models
from django.core.validators import MinValueValidator


class FormFieldType(models.TextChoices):
	"""Tipos de campo soportados para los formularios."""

	TEXT = "text", "Texto"
	TEXTAREA = "textarea", "Texto multilinea"
	NUMBER = "number", "Numero"
	DATE = "date", "Fecha"
	EMAIL = "email", "Email"
	PHONE = "phone", "Telefono"
	SELECT = "select", "Seleccion"
	CHECKBOX = "checkbox", "Checkbox"
	RADIO = "radio", "Radio"
	FILE = "file", "Archivo"


class FormDefinition(models.Model):
	"""Definicion logica de un formulario asociada a un Trámite.

	No contiene los campos; eso vive en las versiones para permitir cambios versionados.
	"""

	name = models.CharField(max_length=160)
	# relacion diferida para evitar dependencia circular en import; usar string 'tramites.Tramite'
	tramite = models.ForeignKey(
		"tramites.Tramite",
		on_delete=models.PROTECT,
		related_name="form_definitions",
	)
	description = models.TextField(blank=True)
	active_version = models.ForeignKey(
		"FormVersion",
		on_delete=models.SET_NULL,
		null=True,
		blank=True,
		related_name="active_in_definitions",
		help_text="Version marcada como activa para uso por defecto",
	)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		verbose_name = "Definicion de formulario"
		verbose_name_plural = "Definiciones de formulario"
		ordering = ("name",)
		unique_together = ("name", "tramite")

	def __str__(self) -> str:  # pragma: no cover
		return f"{self.name} ({self.tramite})"


class FormVersion(models.Model):
	"""Una version de un formulario con su esquema de campos."""

	form = models.ForeignKey(
		FormDefinition, on_delete=models.CASCADE, related_name="versions"
	)
	version = models.PositiveIntegerField(validators=[MinValueValidator(1)])
	# metadata opcional (p. ej., cambios, notas de version)
	changelog = models.TextField(blank=True)
	is_published = models.BooleanField(default=False)
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		verbose_name = "Version de formulario"
		verbose_name_plural = "Versiones de formulario"
		unique_together = ("form", "version")
		ordering = ("form", "-version")

	def __str__(self) -> str:  # pragma: no cover
		return f"{self.form.name} v{self.version}"


class FormField(models.Model):
	"""Campo perteneciente a una version de formulario."""

	form_version = models.ForeignKey(
		FormVersion, on_delete=models.CASCADE, related_name="fields"
	)
	name = models.CharField(max_length=100, help_text="Identificador estandar sin espacios")
	label = models.CharField(max_length=160)
	type = models.CharField(max_length=20, choices=FormFieldType.choices)
	help_text = models.CharField(max_length=255, blank=True)
	required = models.BooleanField(default=False)
	order = models.PositiveIntegerField(default=0)
	# Validaciones configurables por JSON (p. ej., {"min":0,"max":10,"pattern":"^[0-9]+$"})
	validations = models.JSONField(default=dict, blank=True)
	# Opciones para selects/radios, en formato lista simple o [{"value":"","label":""}]
	options = models.JSONField(default=list, blank=True)

	class Meta:
		verbose_name = "Campo de formulario"
		verbose_name_plural = "Campos de formulario"
		ordering = ("form_version", "order", "id")
		unique_together = ("form_version", "name")

	def __str__(self) -> str:  # pragma: no cover
		return f"{self.form_version}: {self.label}"
