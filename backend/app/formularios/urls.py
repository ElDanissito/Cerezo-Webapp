from django.urls import path
from .views import FormDefinitionListView, FormDefinitionDetailView

urlpatterns = [
    path("", FormDefinitionListView.as_view(), name="formdefinition-list"),
    path("<int:pk>/", FormDefinitionDetailView.as_view(), name="formdefinition-detail"),
]
