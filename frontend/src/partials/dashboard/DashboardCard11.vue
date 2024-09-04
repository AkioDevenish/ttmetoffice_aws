<template>
  <div class="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
    <header class="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
      <h2 class="font-semibold text-gray-800 dark:text-gray-100">
        Asja Weather Station
      </h2>
      <div class="flex items-center">
        <select 
          class="p-2 border rounded text-sm mr-2"
          v-model="selectedMetric"
        >
          <option v-for="option in metricOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
        <div class="text-sm text-gray-500">
          Last updated: {{ lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never' }}
        </div>
      </div>
    </header>
    <div v-if="loading && AsjaTimeline.length === 0" class="flex justify-center items-center h-64">Loading...</div>
    <div v-else-if="error && AsjaTimeline.length === 0" class="text-center text-red-500">{{ error }}</div>
    <div v-else>
      <RealtimeChart v-if="chartData" :data="chartData" :width="595" :height="248" :selectedMetric="selectedMetric" stationName="Asja" />
      <div v-else class="flex items-center justify-center h-64">
        <div class="text-gray-500">No timeline data available for the selected metric</div>
      </div>
      <div class="text-xs text-gray-400 text-right mt-2 pr-4">
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
  name: 'DashboardCard11',
  components: {
    RealtimeChart,
  },
  setup() {
    const AsjaTimeline = ref([]);
    const selectedMetric = ref('temperature');
    const chartData = ref(null);
    const error = ref(null);
    const loading = ref(true);
    const lastUpdated = ref(null);
    const lastFetched = ref(new Date());

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
        console.log('Raw API response:', response.data);
        
        if (Array.isArray(response.data) && response.data.length > 0) {
          const AsjaDataPoints = response.data.filter(station => station.name.toLowerCase() === 'asja');
          if (AsjaDataPoints.length > 0) {
            console.log('Asja data points found:', AsjaDataPoints);
            AsjaTimeline.value = AsjaDataPoints.sort((a, b) => new Date(a.recorded_at) - new Date(b.recorded_at)).slice(-24);
            lastUpdated.value = new Date(AsjaDataPoints[AsjaDataPoints.length - 1].recorded_at);
          } else {
            console.error('No Asja data points found in the data');
            error.value = 'No Asja data points found in the data';
          }
        } else {
          console.error('Unexpected data format or empty array');
          error.value = 'Unexpected data format or no data available';
        }
        lastFetched.value = new Date();
      } catch (err) {
        console.error('Error fetching data:', err);
        error.value = 'Error fetching data: ' + err.message;
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchData();
      const interval = setInterval(fetchData, 3600000); // Update every hour
      return () => clearInterval(interval);
    });

    watch([AsjaTimeline, selectedMetric], () => {
      if (AsjaTimeline.value.length > 0 && selectedMetric.value) {
        const labels = AsjaTimeline.value.map(entry => new Date(entry.recorded_at).toLocaleTimeString());
        const data = AsjaTimeline.value.map(entry => parseFloat(entry[selectedMetric.value]));
        
        chartData.value = {
          labels: labels,
          datasets: [{
            data: data,
            fill: true,
            backgroundColor: `rgba(${hexToRGB(tailwindConfig().theme.colors.amber[600])}, 0.08)`,
            borderColor: tailwindConfig().theme.colors.amber[600],
            borderWidth: 2,
            tension: 0,
            pointRadius: 0,
            pointHoverRadius: 3,
            pointBackgroundColor: tailwindConfig().theme.colors.amber[600],
            pointHoverBackgroundColor: tailwindConfig().theme.colors.amber[600],
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
      AsjaTimeline,
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