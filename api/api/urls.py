"""
URL configuration for api project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
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
from django.conf import settings
from django.conf.urls.static import static
from apps.authentication.health import health_check, readiness_check, liveness_check

urlpatterns = [
    path('admin/', admin.site.urls),

    # Health check endpoints
    path('health/', health_check, name='health-check'),
    path('ready/', readiness_check, name='readiness-check'),
    path('alive/', liveness_check, name='liveness-check'),

    # API endpoints
    path('api/', include('apps.authentication.urls')),
    path('api/', include('apps.clubs.urls')),
    path('api/', include('apps.horses.urls')),
    path('api/', include('apps.riders.urls')),
    path('api/', include('apps.accounting.urls')),
    path('api/', include('apps.competitions.urls')),
    path('api/', include('apps.entries.urls')),
    path('api/', include('apps.disciplines.urls')),
    path('api/', include('apps.payments.urls')),
    path('api/', include('apps.subscriptions.urls')),
    path('api/', include('apps.arenas.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
