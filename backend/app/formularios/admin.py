from django.contrib import admin
from .models import FormDefinition, FormVersion, FormField


class FormFieldInline(admin.TabularInline):
	model = FormField
	extra = 0
	fields = ("order", "name", "label", "type", "required")
	ordering = ("order",)


class FormVersionInline(admin.StackedInline):
	model = FormVersion
	extra = 0
	show_change_link = True


@admin.register(FormDefinition)
class FormDefinitionAdmin(admin.ModelAdmin):
	list_display = ("name", "tramite", "active_version", "updated_at")
	list_filter = ("tramite",)
	search_fields = ("name", "tramite__title")
	inlines = (FormVersionInline,)


@admin.register(FormVersion)
class FormVersionAdmin(admin.ModelAdmin):
	list_display = ("form", "version", "is_published", "created_at")
	list_filter = ("is_published",)
	search_fields = ("form__name",)
	inlines = (FormFieldInline,)


@admin.register(FormField)
class FormFieldAdmin(admin.ModelAdmin):
	list_display = ("form_version", "order", "name", "label", "type", "required")
	list_filter = ("type", "required")
	search_fields = ("name", "label", "form_version__form__name")
	ordering = ("form_version", "order")
