from rest_framework.views import exception_handler
from rest_framework.exceptions import ValidationError
from rest_framework import status


def custom_exception_handler(exc, context):
    """Map DRF ValidationError to HTTP 422 with a clear message shape.

    Keeps the original error payload under `errors` and adds a generic detail.
    """
    response = exception_handler(exc, context)

    if response is not None and isinstance(exc, ValidationError):
        response.status_code = status.HTTP_422_UNPROCESSABLE_ENTITY
        # Preserve original error dict/list from DRF but wrap with a consistent envelope
        response.data = {
            "detail": "Unprocessable entity: validation error",
            "errors": response.data,
        }

    return response
