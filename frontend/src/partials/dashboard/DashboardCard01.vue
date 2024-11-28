<template>
  <div class="col-span-full xl:col-span-12 bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
    <header class="px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
      <div class="flex justify-between items-center">
        <h2 class="font-semibold text-gray-800 dark:text-gray-100">All Weather Stations</h2>
        <div class="text-sm text-gray-500 dark:text-gray-400">
          Last updated: {{ lastUpdated.toLocaleDateString() }} at {{ lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
        </div>
      </div>
    </header>
    <div class="p-3">
      <div class="overflow-x-auto">
        <table class="table-auto w-full">
          <thead class="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 rounded-sm">
            <tr>
              <th class="p-2"><div class="font-semibold text-left">Weather Station</div></th>
              <th class="p-2"><div class="font-semibold text-center">Temperature</div></th>
              <th class="p-2"><div class="font-semibold text-center">Wind Speed</div></th>
              <th class="p-2"><div class="font-semibold text-center">Wind Direction</div></th>
              <th class="p-2"><div class="font-semibold text-center">Humidity</div></th>
              <th class="p-2"><div class="font-semibold text-center">Precipitation</div></th>
              <th class="p-2"><div class="font-semibold text-center">Solar Radiation</div></th>
              <th class="p-2"><div class="font-semibold text-center">UV Index</div></th>
              <th class="p-2"><div class="font-semibold text-center">Barometric Pressure</div></th>
            </tr>
          </thead>
          <tbody class="text-sm divide-y divide-gray-100 dark:divide-gray-700">
            <tr v-if="loading && weatherStations.size === 0">
              <td colspan="9" class="text-center p-4">
                <div class="flex justify-center items-center h-64">
                  <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              </td>
            </tr>
            <tr v-if="error">
              <td colspan="9" class="text-center p-4 text-red-600 font-semibold">
                <svg class="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Error: {{ error }}
              </td>
            </tr>
            <tr v-if="!loading && !error && sortedWeatherStations.length === 0">
              <td colspan="9" class="text-center p-4 text-gray-500 dark:text-gray-400">No data available</td>
            </tr>
            <tr v-for="station in sortedWeatherStations" :key="station.name" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-150">
              <td class="p-2">
                <div class="flex items-center">
                  <div class="text-gray-800 dark:text-gray-100 font-medium">{{ station.name }}</div>
                </div>
              </td>
              <td class="p-2">
                <div class="text-center text-green-500 font-semibold">{{ station.temperature }}°C</div>
              </td>
              <td class="p-2">
                <div class="text-center text-blue-500 font-semibold">{{ station.wind_speed }} km/h</div>
              </td>
              <td class="p-2">
                <div class="text-center text-purple-500 font-semibold">{{ station.wind_direction }}°</div>
              </td>
              <td class="p-2">
                <div class="text-center text-yellow-500 font-semibold">{{ station.humidity }}%</div>
              </td>
              <td class="p-2">
                <div class="text-center text-blue-400 font-semibold">{{ station.precipitation }} mm</div>
              </td>
              <td class="p-2">
                <div class="text-center text-orange-500 font-semibold">{{ station.solar_radiation }} W/m²</div>
              </td>
              <td class="p-2">
                <div class="text-center text-pink-500 font-semibold">{{ station.uv_index }}</div>
              </td>
              <td class="p-2">
                <div class="text-center text-indigo-500 font-semibold">{{ station.barometric_pressure }} hPa</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

export default {
  name: 'WeatherStations',
  setup() {
    const weatherStations = ref(new Map());
    const error = ref(null);
    const loading = ref(true);
    const lastUpdated = ref(new Date());

    const sortedWeatherStations = computed(() => {
      return Array.from(weatherStations.value.values()).sort((a, b) => a.name.localeCompare(b.name));
    });

    const fetchData = async () => {
      try {
        loading.value = true;
        const response = await axios.get('http://127.0.0.1:8000/api/weather_stations/', {
          headers: {
            'Accept': 'application/json',
          }
        });

        console.log('API response:', response.data);

        if (Array.isArray(response.data)) {
          response.data.forEach(newStation => {
            if (weatherStations.value.has(newStation.name)) {
              // Update existing station data
              const existingStation = weatherStations.value.get(newStation.name);
              Object.assign(existingStation, newStation);
            } else {
              // Add new station
              weatherStations.value.set(newStation.name, newStation);
            }
          });
          lastUpdated.value = new Date();
        } else {
          error.value = 'Unexpected data format: Expected an array';
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        error.value = 'Error fetching data: ' + err.message;
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchData();
      const interval = setInterval(fetchData, 300000); // Fetch data every 5 minutes
      return () => clearInterval(interval);
    });

    return {
      weatherStations,
      sortedWeatherStations,
      error,
      loading,
      lastUpdated,
    };
  },
};
</script>

<style scoped>
/* Add your styles here if needed */
</style>