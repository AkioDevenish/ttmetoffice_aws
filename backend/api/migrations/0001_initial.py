# Generated by Django 4.2 on 2024-08-23 14:44

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='WeatherStation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('temperature', models.DecimalField(decimal_places=2, max_digits=5)),
                ('wind_speed', models.DecimalField(decimal_places=2, max_digits=5)),
                ('wind_direction', models.IntegerField()),
                ('humidity', models.IntegerField()),
                ('barometric_pressure', models.DecimalField(decimal_places=2, max_digits=6)),
                ('uv_index', models.DecimalField(decimal_places=1, max_digits=3)),
                ('solar_radiation', models.DecimalField(decimal_places=2, max_digits=6)),
                ('precipitation', models.DecimalField(decimal_places=2, max_digits=5)),
                ('recorded_at', models.DateTimeField()),
            ],
        ),
    ]
