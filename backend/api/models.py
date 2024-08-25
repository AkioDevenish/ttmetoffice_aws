from django.db import models

class WeatherStation(models.Model):
    name = models.CharField(max_length=255)
    temperature = models.DecimalField(max_digits=5, decimal_places=2)
    wind_speed = models.DecimalField(max_digits=5, decimal_places=2)
    wind_direction = models.IntegerField()
    humidity = models.IntegerField()
    barometric_pressure = models.DecimalField(max_digits=6, decimal_places=2)
    uv_index = models.DecimalField(max_digits=3, decimal_places=1)
    solar_radiation = models.DecimalField(max_digits=6, decimal_places=2)
    precipitation = models.DecimalField(max_digits=5, decimal_places=2)
    recorded_at = models.DateTimeField()

    def __str__(self):
        return self.name