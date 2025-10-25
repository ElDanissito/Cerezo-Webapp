from django.urls import path
from .views import recent_tramites, top_tramites_by_clicks, top_tramites_by_purchases_last_7_days

urlpatterns = [
    path('recent/', recent_tramites, name='tramites_recent'),
    path('top-clicks/', top_tramites_by_clicks, name='tramites_top_clicks'),
    path('top-purchases/', top_tramites_by_purchases_last_7_days, name='tramites_top_purchases'),
]
