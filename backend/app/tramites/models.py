from django.db import models


class TramiteType(models.Model):
	"""Type/Category of procedure (e.g., Documents, Finance)."""

	name = models.CharField(max_length=120, unique=True)
	slug = models.SlugField(max_length=140, unique=True)
	description = models.TextField(blank=True)

	class Meta:
		verbose_name = "Tipo de trámite"
		verbose_name_plural = "Tipos de trámite"
		ordering = ("name",)

	def __str__(self) -> str:  # pragma: no cover - representational
		return self.name


class Tramite(models.Model):
	"""Basic Procedure entity used to associate forms or other metrics."""

	title = models.CharField(max_length=180)
	slug = models.SlugField(max_length=200, unique=True)
	tipo = models.ForeignKey(
		TramiteType,
		on_delete=models.PROTECT,
		related_name="tramites",
		help_text="Tipo de trámite al que pertenece",
	)
	description = models.TextField(blank=True)
	is_active = models.BooleanField(default=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		verbose_name = "Trámite"
		verbose_name_plural = "Trámites"
		indexes = [
			models.Index(fields=["slug"]),
			models.Index(fields=["is_active"]),
		]
		ordering = ("title",)

	def __str__(self) -> str:  # pragma: no cover
		return self.title
