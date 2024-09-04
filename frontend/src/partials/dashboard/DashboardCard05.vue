<template>
  <div class="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
    <header class="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
      <h2 class="font-semibold text-gray-800 dark:text-gray-100">
        Port of Spain Weather Station
      </h2>
      <div class="flex items-center">
        <select 
          class="p-2 border rounded text-sm mr-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
          v-model="selectedMetric"
        >
          <option v-for="option in metricOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
        <div v-if="lastUpdated" class="text-sm text-gray-500 dark:text-gray-400">
          Last updated: {{ lastUpdated.toLocaleTimeString() }}
        </div>
      </div>
    </header>
    <div v-if="loading && portOfSpainTimeline.length === 0" class="flex justify-center items-center h-64">Loading...</div>
    <div v-else-if="error && portOfSpainTimeline.length === 0" class="text-center text-red-500 dark:text-red-400">{{ error }}</div>
    <div v-else>
      <RealtimeChart v-if="chartData" :data="chartData" :width="595" :height="248" :selectedMetric="selectedMetric" stationName="Port of Spain" />
      <div v-else class="flex items-center justify-center h-64">
        <div class="text-gray-500 dark:text-gray-400">No timeline data available for the selected metric</div>
      </div>
      <div v-if="lastFetched" class="text-xs text-gray-400 dark:text-gray-500 text-right mt-2 pr-4">
        Last fetched: {{ lastFetched.toLocaleTimeString() }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import RealtimeChart from '../../charts/RealtimeChart.vue';
import { tailwindConfig, hexToRGB } from '../../utils/Utils';

export default {
  name: 'DashboardCard05',
  components: {
    RealtimeChart,
  },
  setup() {
    const portOfSpainTimeline = ref([]);
    const selectedMetric = ref('temperature');
    const chartData = ref(null);
    const error = ref(null);
    const loading = ref(true);
    const lastUpdated = ref(null);
    const lastFetched = ref(null);

    const metricOptions = [
      { value: 'temperature', label: 'Temperature (°C)' },
      { value: 'wind_speed', label: 'Wind Speed (km/h)' },
      { value: 'wind_direction', label: 'Wind Direction (°)' },
      { value: 'humidity', label: 'Humidity (%)' },
      { value: 'precipitation', label: 'Precipitation (mm)' },
      { value: 'solar_radiation', label: 'Solar Radiation (W/m²)' },
      { value: 'uv_index', label: 'UV Index' },
      { value: 'barometric_pressure', label: 'Barometric Pressure (hPa)' }
    ];

    const fetchData = async () => {
      try {
        loading.value = true;
        const response = await axios.get('http://127.0.0.1:8000/api/weather_stations/', {
          headers: { 'Accept': 'application/json' }
        });
        console.log('API response:', response.data);
        
        if (Array.isArray(response.data) && response.data.length > 0) {
          const portOfSpainDataPoints = response.data.filter(station => 
            station.name.toLowerCase() === 'port of spain'
          );
          if (portOfSpainDataPoints.length > 0) {
            console.log('Port of Spain data points:', portOfSpainDataPoints);
            portOfSpainTimeline.value = portOfSpainDataPoints.sort((a, b) => new Date(a.recorded_at) - new Date(b.recorded_at)).slice(-24);
            lastUpdated.value = new Date(portOfSpainDataPoints[portOfSpainDataPoints.length - 1].recorded_at);
            error.value = null;
          } else {
            console.warn('No Port of Spain data points found');
            error.value = 'No data available for Port of Spain';
          }
        } else {
          console.error('Unexpected data format or empty array');
          error.value = 'Unexpected data format or no data available';
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        error.value = `Error fetching data: ${err.message}`;
      } finally {
        loading.value = false;
        lastFetched.value = new Date();
      }
    };

    onMounted(() => {
      fetchData();
      const interval = setInterval(fetchData, 3600000); // Update every hour
      return () => clearInterval(interval);
    });

    watch([portOfSpainTimeline, selectedMetric], () => {
      if (portOfSpainTimeline.value.length > 0 && selectedMetric.value) {
        const labels = portOfSpainTimeline.value.map(entry => new Date(entry.recorded_at).toLocaleTimeString());
        const data = portOfSpainTimeline.value.map(entry => parseFloat(entry[selectedMetric.value]));
        
        chartData.value = {
          labels: labels,
          datasets: [{
            data: data,
            fill: true,
            backgroundColor: `rgba(${hexToRGB(tailwindConfig().theme.colors.purple[500])}, 0.08)`,
            borderColor: tailwindConfig().theme.colors.purple[500],
            borderWidth: 2,
            tension: 0,
            pointRadius: 0,
            pointHoverRadius: 3,
            pointBackgroundColor: tailwindConfig().theme.colors.purple[500],
            pointHoverBackgroundColor: tailwindConfig().theme.colors.purple[500],
            pointBorderWidth: 0,
            pointHoverBorderWidth: 0,          
            clip: 20,
          }],
        };
      } else {
        chartData.value = null;
      }
    });

    return {
      portOfSpainTimeline,
      selectedMetric,
      chartData,
      error,
      loading,
      lastUpdated,
      lastFetched,
      metricOptions,
    };
  },
};
</script>

<style scoped>
/* Add any scoped styles here */
</style>