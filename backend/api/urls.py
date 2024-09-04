from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import WeatherStationViewSet, CreateUserView  # Ensure correct import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'weather-stations', WeatherStationViewSet)

urlpatterns = [
    path('', include(router.urls)),
]