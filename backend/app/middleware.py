from django.utils.deprecation import MiddlewareMixin
from django.utils.html import strip_tags
import json


class SanitizeInputMiddleware(MiddlewareMixin):
    """Middleware simple y defensiva para sanitizar inputs del request.

    - Limpia tags HTML de request.GET y request.POST (QueryDicts).
    - Para application/json intenta parsear el body y eliminar tags en todos
      los valores string (recursivamente).

    NOTAS:
    - Esto es una defensa por capa: seguir usando validadores/serializers en cada
      endpoint. Para sanitización HTML más robusta, usar bleach en backend.
    - Evita modificaciones destructivas sobre tipos no string.
    """

    def _sanitize_value(self, value):
        if isinstance(value, str):
            return strip_tags(value)
        if isinstance(value, list):
            return [self._sanitize_value(v) for v in value]
        if isinstance(value, dict):
            return {k: self._sanitize_value(v) for k, v in value.items()}
        return value

    def process_request(self, request):
        # Sanitizar query params
        try:
            if request.GET:
                q = request.GET.copy()
                for key in q.keys():
                    vals = q.getlist(key)
                    clean_vals = [strip_tags(v) for v in vals]
                    if len(clean_vals) == 1:
                        q[key] = clean_vals[0]
                    else:
                        q.setlist(key, clean_vals)
                request.GET = q
        except Exception:
            # No romper petición por problemas en sanitización
            pass

        # Sanitizar body para POST/PUT/PATCH
        try:
            content_type = request.META.get('CONTENT_TYPE', '') or request.content_type or ''

            if request.method in ('POST', 'PUT', 'PATCH'):
                # JSON bodies: parsear y reescribir request._body con la versión limpia
                if 'application/json' in content_type:
                    body = request.body
                    if body:
                        try:
                            parsed = json.loads(body.decode('utf-8'))
                            cleaned = self._sanitize_value(parsed)
                            new_body = json.dumps(cleaned).encode('utf-8')
                            # Reescribir el body para que DRF/Django lo parseen luego
                            request._body = new_body
                        except Exception:
                            # Si no se puede parsear, seguir sin interrumpir
                            pass
                else:
                    # Formularios tradicionales: request.POST (QueryDict)
                    if hasattr(request, 'POST') and request.POST:
                        q = request.POST.copy()
                        for key in q.keys():
                            vals = q.getlist(key)
                            clean_vals = [strip_tags(v) for v in vals]
                            if len(clean_vals) == 1:
                                q[key] = clean_vals[0]
                            else:
                                q.setlist(key, clean_vals)
                        request.POST = q
        except Exception:
            # Fail-safe: no interrumpir la petición
            pass

        return None
