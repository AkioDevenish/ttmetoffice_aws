import decimal
import xml.etree.ElementTree as ET
from django.core.management.base import BaseCommand
from django.utils import timezone
from api.models import WeatherStation
import os
from decimal import Decimal
from datetime import datetime

class Command(BaseCommand):
    help = 'Import weather data for all stations from XML file, creating new entries for each reading'

    def handle(self, *args, **options):
        current_time = timezone.now().strftime("%Y-%m-%d %H:%M:%S")
        self.stdout.write(self.style.SUCCESS(f"Import started at {current_time}"))

        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
        xml_file_path = os.path.join(base_dir, 'data', 'weather-station-data.xml')

        self.stdout.write(self.style.SUCCESS(f"Looking for XML file at: {xml_file_path}"))

        if not os.path.exists(xml_file_path):
            self.stdout.write(self.style.ERROR(f"XML file not found at {xml_file_path}"))
            return

        try:
            tree = ET.parse(xml_file_path)
            root = tree.getroot()

            for station_elem in root.findall('station'):
                # Create a new WeatherStation instance for each station element
                new_reading = WeatherStation()

                # Process each field for the station
                fields = ['name', 'temperature', 'wind_speed', 'wind_direction', 'humidity',
                          'barometric_pressure', 'uv_index', 'solar_radiation', 'precipitation']

                for field in fields:
                    elem = station_elem.find(field)
                    if elem is not None and elem.text:
                        try:
                            if field in ['wind_direction', 'humidity', 'uv_index']:
                                value = int(elem.text)
                            elif field == 'name':
                                value = elem.text
                            else:
                                value = Decimal(elem.text)
                            setattr(new_reading, field, value)
                        except (ValueError, decimal.InvalidOperation):
                            self.stdout.write(self.style.WARNING(f"Invalid {field} value: {elem.text}"))
                    else:
                        setattr(new_reading, field, None)

                # Handle timestamp
                timestamp_elem = station_elem.find('timestamp')
                if timestamp_elem is not None and timestamp_elem.text:
                    try:
                        recorded_at = datetime.fromisoformat(timestamp_elem.text)
                        new_reading.recorded_at = recorded_at
                    except ValueError:
                        self.stdout.write(self.style.WARNING(f"Invalid timestamp: {timestamp_elem.text}"))
                        new_reading.recorded_at = timezone.now()
                else:
                    new_reading.recorded_at = timezone.now()

                new_reading.save()
                self.stdout.write(self.style.SUCCESS(f"Created new entry for {new_reading.name} weather data at {new_reading.recorded_at}."))

            self.stdout.write(self.style.SUCCESS(f'Weather data import completed at {timezone.now().strftime("%Y-%m-%d %H:%M:%S")}'))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error importing weather data: {str(e)}'))
            import traceback
            self.stdout.write(self.style.ERROR(traceback.format_exc()))