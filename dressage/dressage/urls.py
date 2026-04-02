"""
URL configuration for dressage project.

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
from django.urls import path
from ninja import NinjaAPI

from apps.users.api import router as users_router
from apps.authentication.api import router as auth_router
from apps.horse.api import router as horse_router
from apps.years.api import router as years_router
from apps.memberships.api import router as memberships_router
from apps.riders.api import router as riders_router

api = NinjaAPI(
    title="Dressage API",
    version="1.0.0",
    description="Dressage Riding System API - User Management, Authentication, Competition, Years, Memberships, Riders & Horses"
)

api.add_router("auth", auth_router)
api.add_router("users", users_router)
api.add_router("", horse_router)
api.add_router("", years_router)
api.add_router("", memberships_router)
api.add_router("", riders_router)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api.urls),
]
