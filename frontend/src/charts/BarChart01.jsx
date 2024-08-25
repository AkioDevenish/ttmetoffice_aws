import React, { useRef, useEffect, useState } from 'react';
import { Chart, BarController, BarElement, LinearScale, Title, Tooltip, Legend, CategoryScale } from 'chart.js';
import { useThemeProvider } from '../utils/ThemeContext';
import { enUS } from 'date-fns/locale';

Chart.register(BarController, BarElement, LinearScale, Title, Tooltip, Legend, CategoryScale);
import 'chartjs-adapter-date-fns'; // Use date-fns adapter

function BarChart01({ data, width, height, activeDataset }) {
  const canvasRef = useRef(null);
  const [chart, setChart] = useState(null);
  const { currentTheme } = useThemeProvider();
  const darkMode = currentTheme === 'dark';

  useEffect(() => {
	const ctx = canvasRef.current?.getContext('2d');
	if (!ctx) return;

	if (chart) {
	  chart.destroy(); // Clean up previous chart instance
	}

	const newChart = new Chart(ctx, {
	  type: 'bar',
	  data: data || { labels: [], datasets: [] },
	  options: {
		layout: {
		  padding: {
			top: 20,
			bottom: 20,
			left: 20,
			right: 20,
		  },
		},
		scales: {
		  x: {
			type: 'time', // Use time scale for x-axis
			time: {
			  unit: 'hour',
			  displayFormats: {
				hour: 'HH:mm'
			  }
			},
			adapters: {
			  date: {
				locale: enUS
			  }
			},
			grid: {
			  display: false,
			},
			ticks: {
			  autoSkip: true,
			  maxTicksLimit: 8,
			  align: 'center',
			  color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
			},
		  },
		  y: {
			beginAtZero: true,
			grid: {
			  color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
			},
			ticks: {
			  callback: (value) => formatYAxisTick(value, activeDataset),
			  color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
			},
		  },
		},
		plugins: {
		  tooltip: {
			backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
			titleColor: darkMode ? '#fff' : '#000',
			bodyColor: darkMode ? '#fff' : '#000',
			borderColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
			borderWidth: 1,
			bodyFont: {
			  size: 14,
			},
			padding: 10,
			displayColors: false,
			callbacks: {
			  title: (context) => new Date(context[0].parsed.x).toLocaleString(),
			  label: (context) => {
				const value = context.parsed.y;
				return `${formatYAxisTick(value, activeDataset)}`;
			  }
			}
		  },
		  legend: {
			display: false,
		  },
		  title: {
			display: true,
			text: getChartTitle(activeDataset),
			color: darkMode ? '#fff' : '#000',
			font: {
			  size: 16,
			},
		  },
		},
		responsive: true,
		maintainAspectRatio: false,
	  },
	});

	setChart(newChart);

	return () => {
	  if (chart) {
		chart.destroy(); // Cleanup on component unmount
	  }
	};
  }, [data, darkMode, activeDataset]);

  function formatYAxisTick(value, dataset) {
	// Your formatting logic here
  }

  function getChartTitle(dataset) {
	// Your title logic here
  }

  return (
	<div style={{ width: '100%', height: '100%', minHeight: '300px' }}>
	  <canvas ref={canvasRef} width={width} height={height}></canvas>
	</div>
  );
}

export default BarChart01;