from django.db import models

class ChatQuestion(models.Model):
    text = models.TextField()
    response = models.TextField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.text[:50]}..."