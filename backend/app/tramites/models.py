from django.db import models


class Tramite(models.Model):
	

	titulo = models.CharField(max_length=255)
	descripcion = models.TextField(blank=True)
	# Tipo del trámite: catálogo o formulario
	TIPO_CATALOGO = 'catalogo'
	TIPO_FORMULARIO = 'formulario'
	TIPO_CHOICES = [
		(TIPO_CATALOGO, 'Catálogo'),
		(TIPO_FORMULARIO, 'Formulario'),
	]
	tipo = models.CharField(max_length=20, choices=TIPO_CHOICES, default=TIPO_CATALOGO)

	# Conteo de clics acumulados
	clicks = models.PositiveIntegerField(default=0)

	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ['-created_at']

	def __str__(self):
		return f"{self.titulo} ({self.created_at.isoformat()})"
