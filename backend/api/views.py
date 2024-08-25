from rest_framework import viewsets
from .models import WeatherStation
from .serializers import WeatherStationSerializer

class WeatherStationViewSet(viewsets.ModelViewSet):
    queryset = WeatherStation.objects.all()
    serializer_class = WeatherStationSerializer