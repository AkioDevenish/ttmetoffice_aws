<template>
  <div class="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
    <header class="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
      <h2 class="font-semibold text-gray-800 dark:text-gray-100">
        UTT Weather Station
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
          Last updated: {{ lastUpdated ? formatDateTime(lastUpdated) : 'Never' }}
        </div>
      </div>
    </header>
    <div v-if="loading" class="flex justify-center items-center h-64">Loading...</div>
    <div v-else-if="error" class="text-center text-red-500 p-4">{{ error }}</div>
    <div v-else-if="!processedData.datasets[0].data.length" class="text-center text-gray-500 p-4">No data available for Brasso station</div>
    <div v-else>
      <RealtimeChart 
        :data="processedData" 
        :width="595" 
        :height="248" 
        :selectedMetric="selectedMetric" 
        stationName="Brasso" 
      />
      <div class="text-xs text-gray-400 text-right mt-2 pr-4">
        Last fetched: {{ formatDateTime(lastFetched) }}
      </div>
    </div>
    <!-- Debug Information -->
    <div class="text-xs text-gray-400 mt-2 p-4 border-t border-gray-100 dark:border-gray-700/60">
      <div>Raw Data Length: {{ rawData.length }}</div>
      <div>Processed Data Length: {{ processedData.datasets[0].data.length }}</div>
      <div>Selected Metric: {{ selectedMetric }}</div>
      <div>Last Fetched: {{ formatDateTime(lastFetched) }}</div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, computed } from 'vue';
import axios from 'axios';
import RealtimeChart from '../../charts/RealtimeChart.vue';

export default {
  name: 'DashboardCard10',
  components: {
    RealtimeChart,
  },
  setup() {
    const rawData = ref([]);
    const selectedMetric = ref('temperature');
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
        error.value = null;
        const response = await axios.get('http://127.0.0.1:8000/api/weather_stations/', {
          headers: { 'Accept': 'application/json' }
        });
        console.log('Raw API response:', response.data);
        
        if (Array.isArray(response.data) && response.data.length > 0) {
          const UTT_DataPoints = response.data.filter(station => station.name.toLowerCase() === 'utt');
          if (UTT_DataPoints.length > 0) {
            console.log('UTT data points found:', UTT_DataPoints);
            UTT_Timeline.value = UTT_DataPoints.sort((a, b) => new Date(a.recorded_at) - new Date(b.recorded_at)).slice(-24);
            lastUpdated.value = new Date(UTT_DataPoints[UTT_DataPoints.length - 1].recorded_at);
          } else {
            console.error('No UTT data points found in the data');
            error.value = 'No UTT data points found in the data';
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
    const processedData = computed(() => {
      if (!rawData.value.length) return { labels: [], datasets: [{ data: [] }] };

      const labels = rawData.value.map(point => formatDateTime(point.recorded_at));
      const data = rawData.value.map(point => point[selectedMetric.value]);

      return {
        labels,
        datasets: [{
          data,
          borderColor: '#10b981',
          fill: false,
          cubicInterpolationMode: 'monotone',
          tension: 0.4,
        }]
      };
    });

    const formatDateTime = (dateString) => {
      const date = new Date(dateString);
      // Adjust for Trinidad and Tobago time (UTC-4)
      date.setHours(date.getHours() - 5);
      
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'America/Port_of_Spain'
      });
    };

    onMounted(() => {
      fetchData();
      const interval = setInterval(fetchData, 3600000); // Update every hour
      return () => clearInterval(interval);
    });

    watch(rawData, (newData) => {
      console.log('Raw data updated. New length:', newData.length);
    });

    return {
      rawData,
      processedData,
      selectedMetric,
      error,
      loading,
      lastUpdated,
      lastFetched,
      metricOptions,
      formatDateTime,
    };
  }
};
</script>