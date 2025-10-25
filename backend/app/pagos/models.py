from django.db import models


class Purchase(models.Model):

	from django.conf import settings

	# Use the app label 'tramites' in the relation string
	tramite = models.ForeignKey('tramites.Tramite', on_delete=models.CASCADE, related_name='purchases')
	quantity = models.PositiveIntegerField(default=1)
	created_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f"Purchase(tramite_id={self.tramite_id}, qty={self.quantity}, at={self.created_at.isoformat()})"

