from rest_framework import serializers
from .models import WeatherStation

class WeatherStationSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeatherStation
        fields = '__all__'
