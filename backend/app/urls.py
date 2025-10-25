"""
URL configuration for app project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from app.users.views import (
    google_signin,
    google_signup,
    google_callback,
    verify_google_token
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    # Autenticación con Google OAuth
    path('api/auth/google/signin/', google_signin, name='google_signin'),
    path('api/auth/google/signup/', google_signup, name='google_signup'),
    path('api/auth/google/callback/', google_callback, name='google_callback'),
    path('api/auth/google/verify/', verify_google_token, name='verify_google_token'),
    # JWT tokens
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('chatbot/', include('app.chatbot.urls')),
]
