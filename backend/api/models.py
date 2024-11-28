from django.db import models
from django.utils import timezone

class WeatherStation(models.Model):
    name = models.CharField(max_length=255)
    temperature = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    wind_speed = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    wind_direction = models.IntegerField(null=True, blank=True)
    humidity = models.IntegerField(null=True, blank=True)
    barometric_pressure = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    uv_index = models.DecimalField(max_digits=3, decimal_places=1, null=True, blank=True)
    solar_radiation = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    precipitation = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    recorded_at = models.DateTimeField(default=timezone.now, null=True, blank=True)

    def __str__(self):
        return self.name
        