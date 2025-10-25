from django.shortcuts import render
from django.http import JsonResponse
from django.utils import timezone
from .models import ChatQuestion


def last_ten_questions_today(request):
  
    today = timezone.localdate()

    questions = (
        ChatQuestion.objects
        .filter(timestamp__date=today)
        .order_by('-timestamp')[:10]
    )

    if not questions:
        return JsonResponse({
            "message": "Sin consultas al chatbot hoy",
            "questions": []
        })

    data = [
        {
            "question": q.text,
            "timestamp": q.timestamp.strftime("%H:%M:%S")
        }
        for q in questions
    ]

    return JsonResponse({"questions": data})
