from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WeatherStationViewSet

router = DefaultRouter()
router.register(r'weather-stations', WeatherStationViewSet)

urlpatterns = [
    path('', include(router.urls)),
]