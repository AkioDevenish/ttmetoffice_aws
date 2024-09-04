<template>
  <div>
    <div class="px-5 py-3">
      <div class="flex items-start">
        <div class="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2 tabular-nums">
          {{ formattedCurrentValue }}
          <span class="text-xl ml-1">{{ metricUnits[selectedMetric] }}</span>
        </div>
        <div v-if="change !== null" :class="`text-sm font-medium ${change >= 0 ? 'text-green-500' : 'text-red-500'} flex items-center`">
          <arrow-up-icon v-if="change >= 0" :size="16" />
          <arrow-down-icon v-else :size="16" />
          <span class="ml-1">{{ formatValue(Math.abs(change), selectedMetric) }}</span>
        </div>
      </div>
    </div>
    <div class="grow">
      <canvas ref="canvasRef" :width="width" :height="height"></canvas>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, computed } from 'vue';
import Chart from 'chart.js/auto';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-vue-next';

const metricUnits = {
  temperature: '°C',
  wind_speed: 'km/h',
  wind_direction: '°',
  humidity: '%',
  precipitation: 'mm',
  solar_radiation: 'W/m²',
  uv_index: '',
  barometric_pressure: 'hPa'
};

const stationColors = {
  'Brasso': '#8b5cf6',
  'Piacro': '#3b82f6',
  'Penal': '#10b981',
  'Port of Spain': '#4a5568',
  'Guayaguayare': '#f97316',
  'Toco': '#eab308',
  'Synoptic': '#047857',
  'UWI': '#be123c',
  'Asja': '#d97706',
  'UTT': '',
};

export default {
  name: 'RealtimeChart',
  components: {
    ArrowUpIcon,
    ArrowDownIcon
  },
  props: {
    data: Object,
    width: Number,
    height: Number,
    selectedMetric: String,
    stationName: String
  },
  setup(props) {
    const canvasRef = ref(null);
    const currentValue = ref(null);
    const change = ref(null);
    let chart = null;

    const formatValue = (value, metric) => {
      if (value === null || value === undefined || isNaN(value)) {
        return '--';
      }
      const numValue = Number(value);
      if (isNaN(numValue)) {
        return '--';
      }
      switch (metric) {
        case 'temperature':
        case 'wind_speed':
        case 'solar_radiation':
        case 'uv_index':
          return numValue.toFixed(1);
        case 'humidity':
        case 'wind_direction':
          return Math.round(numValue).toString();
        case 'precipitation':
          return numValue.toFixed(2);
        case 'barometric_pressure':
          return numValue.toFixed(1);
        default:
          return numValue.toString();
      }
    };

    const convertToTrinidadTime = (timeString) => {
      let date;
      if (timeString.includes(':')) {
        const today = new Date();
        const [time, period] = timeString.split(' ');
        const [hours, minutes] = time.split(':');
        date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 
          period === 'PM' ? parseInt(hours) + 12 : parseInt(hours), 
          parseInt(minutes));
      } else {
        date = new Date(timeString);
      }

      if (isNaN(date.getTime())) {
        console.error('Invalid date:', timeString);
        return timeString;
      }

      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true,
        timeZone: 'America/Port_of_Spain'
      });
    };

    const createChart = () => {
      if (!canvasRef.value || !props.data || !props.data.datasets || props.data.datasets.length === 0) return;

      const ctx = canvasRef.value.getContext('2d');
      chart = new Chart(ctx, {
        type: 'line',
        data: {
          ...props.data,
          labels: props.data.labels.map(convertToTrinidadTime)
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: true,
              mode: 'index',
              intersect: false,
              callbacks: {
                title: (context) => convertToTrinidadTime(props.data.labels[context[0].dataIndex])
              }
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
              ticks: {
                callback: function(value, index) {
                  return convertToTrinidadTime(props.data.labels[index]);
                }
              }
            },
            y: {
              beginAtZero: false,
              grid: {
                color: 'rgba(0, 0, 0, 0.1)',
              },
            },
          },
        },
      });

      updateChartTheme();
    };

    const updateChartTheme = () => {
      if (!chart) return;

      const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      const textColor = currentTheme === 'dark' ? '#fff' : '#000';
      const gridColor = currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

      chart.options.scales.x.ticks.color = textColor;
      chart.options.scales.y.ticks.color = textColor;
      chart.options.scales.y.grid.color = gridColor;
      chart.options.plugins.tooltip.titleColor = textColor;
      chart.options.plugins.tooltip.bodyColor = textColor;
      chart.options.plugins.tooltip.backgroundColor = currentTheme === 'dark' ? '#333' : '#fff';
      chart.options.plugins.tooltip.borderColor = currentTheme === 'dark' ? '#555' : '#e0e0e0';

      chart.update('none');
    };

    const updateCurrentValueAndChange = () => {
      if (props.data && props.data.datasets && props.data.datasets[0].data) {
        const values = props.data.datasets[0].data;
        if (values.length > 1) {
          currentValue.value = values[values.length - 1];
          change.value = Number(currentValue.value) - Number(values[values.length - 2]);
        } else {
          currentValue.value = null;
          change.value = null;
        }
      }
    };

    onMounted(() => {
      createChart();
      updateCurrentValueAndChange();

      const observer = new MutationObserver(updateChartTheme);
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

      return () => {
        if (chart) {
          chart.destroy();
        }
        observer.disconnect();
      };
    });

    watch(() => [props.data, props.selectedMetric, props.stationName], () => {
      if (chart) {
        chart.destroy();
      }
      createChart();
      updateCurrentValueAndChange();
    }, { deep: true });

    const formattedCurrentValue = computed(() => formatValue(currentValue.value, props.selectedMetric));

    return {
      canvasRef,
      currentValue,
      change,
      formattedCurrentValue,
      formatValue,
      metricUnits
    };
  }
};
</script>