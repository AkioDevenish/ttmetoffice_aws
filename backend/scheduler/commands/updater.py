from django.core.management.base import BaseCommand
from django.utils import timezone
from api.models import WeatherStation
import random

class Command(BaseCommand):
    help = 'Update weather data for all stations'

    def handle(self, *args, **options):
        stations = WeatherStation.objects.all()

        for station in stations:
            # Simulate fetching new weather data
            new_data = {
                'temperature': self.get_random_float(0, 35),
                'wind_speed': self.get_random_float(0, 30),
                'wind_direction': random.randint(0, 359),
                'humidity': random.randint(0, 100),
                'barometric_pressure': self.get_random_float(950, 1050, 2),
                'uv_index': self.get_random_float(0, 11, 1),
                'solar_radiation': self.get_random_float(0, 1200, 2),
                'precipitation': self.get_random_float(0, 100, 2),
                'recorded_at': timezone.now(),
            }

            for key, value in new_data.items():
                setattr(station, key, value)
            station.save()

            self.stdout.write(self.style.SUCCESS(f"Updated {station.name} weather data."))

        self.stdout.write(self.style.SUCCESS('Weather data update completed.'))

    def get_random_float(self, min_value, max_value, decimals=1):
        return round(random.uniform(min_value, max_value), decimals)