from django.urls import path
from .views import last_ten_questions_today

urlpatterns = [
    path('last-ten-questions/', last_ten_questions_today, name='last_ten_questions_today'),
]