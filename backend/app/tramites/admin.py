from django.contrib import admin
from .models import TramiteType, Tramite


@admin.register(TramiteType)
class TramiteTypeAdmin(admin.ModelAdmin):
	list_display = ("name", "slug")
	search_fields = ("name", "slug")
	prepopulated_fields = {"slug": ("name",)}


@admin.register(Tramite)
class TramiteAdmin(admin.ModelAdmin):
	list_display = ("title", "slug", "tipo", "is_active", "updated_at")
	list_filter = ("tipo", "is_active")
	search_fields = ("title", "slug", "description")
	prepopulated_fields = {"slug": ("title",)}
