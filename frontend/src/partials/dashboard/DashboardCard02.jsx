import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Chart } from 'chart.js';
import { tailwindConfig, hexToRGB } from '../../utils/Utils';
import { chartAreaGradient } from '../../charts/ChartjsConfig';
import EditMenu from '../../components/DropdownEditMenu';

function DashboardCard02() {
  const [chart, setChart] = useState(null);
  const canvas = useRef(null);
  const chartValue = useRef(null);
  const chartDeviation = useRef(null);

  useEffect(() => {
    const ctx = canvas.current;
    // eslint-disable-next-line no-unused-vars
    const newChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [
          '12-01-2022', '01-01-2023', '02-01-2023', '03-01-2023', '04-01-2023', 
          '05-01-2023', '06-01-2023', '07-01-2023', '08-01-2023', '09-01-2023', 
          '10-01-2023', '11-01-2023', '12-01-2023', '01-01-2024', '02-01-2024', 
          '03-01-2024', '04-01-2024', '05-01-2024', '06-01-2024', '07-01-2024', 
          '08-01-2024', '09-01-2024', '10-01-2024', '11-01-2024', '12-01-2024', '01-01-2025'
        ],
        datasets: [
          // Indigo line
          {
            data: [622, 622, 426, 471, 365, 365, 238, 324, 288, 206, 324, 324, 500, 409, 409, 273, 232, 273, 500, 570, 767, 808, 685, 767, 685, 685],
            fill: true,
            backgroundColor: function(context) {
              const chart = context.chart;
              const {ctx, chartArea} = chart;
              return chartAreaGradient(ctx, chartArea, [
                { stop: 0, color: `rgba(${hexToRGB(tailwindConfig().theme.colors.violet[500])}, 0)` },
                { stop: 1, color: `rgba(${hexToRGB(tailwindConfig().theme.colors.violet[500])}, 0.2)` }
              ]);
            },
            borderColor: tailwindConfig().theme.colors.violet[500],
            borderWidth: 2,
            tension: 0,
            pointRadius: 0,
            pointHoverRadius: 3,
            pointBackgroundColor: tailwindConfig().theme.colors.violet[500],
            pointHoverBackgroundColor: tailwindConfig().theme.colors.violet[500],
            pointBorderWidth: 0,
            pointHoverBorderWidth: 0,
            clip: 20,
          },
          // Gray line
          {
            data: [732, 610, 610, 504, 504, 504, 349, 349, 504, 342, 504, 610, 391, 192, 154, 273, 191, 191, 126, 263, 349, 252, 423, 622, 470, 532],
            borderColor: `rgba(${hexToRGB(tailwindConfig().theme.colors.gray[500])}, 0.25)`,
            borderWidth: 2,
            tension: 0,
            pointRadius: 0,
            pointHoverRadius: 3,
            pointBackgroundColor: `rgba(${hexToRGB(tailwindConfig().theme.colors.gray[500])}, 0.25)`,
            pointHoverBackgroundColor: `rgba(${hexToRGB(tailwindConfig().theme.colors.gray[500])}, 0.25)`,
            pointBorderWidth: 0,
            pointHoverBorderWidth: 0,
            clip: 20,
          },
        ],
      },
      options: {
        layout: {
          padding: 20,
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              drawBorder: false,
            },
            ticks: {
              callback: (value) => `$${value}`,
            },
          },
          x: {
            type: 'time',
            time: {
              parser: 'MM-DD-YYYY',
              unit: 'month',
              displayFormats: {
                month: 'MMM YY',
              },
            },
            grid: {
              display: false,
              drawBorder: false,
            },
            ticks: {
              autoSkipPadding: 48,
              maxRotation: 0,
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              title: () => false, // Disable tooltip title
              label: (context) => `$${context.parsed.y}`,
            },
          },
          legend: {
            display: false,
          },
        },
        interaction: {
          intersect: false,
          mode: 'nearest',
        },
        maintainAspectRatio: false,
      },
    });
    setChart(newChart);
    return () => newChart.destroy();
  }, []);

  // Update header values
  useEffect(() => {
    if (chart) {
      const currentValue = chart.data.datasets[0].data[chart.data.datasets[0].data.length - 1];
      const previousValue = chart.data.datasets[0].data[chart.data.datasets[0].data.length - 2];
      const diff = ((currentValue - previousValue) / previousValue) * 100;
      chartValue.current.innerHTML = `$${currentValue}`;
      chartDeviation.current.innerHTML = `${diff > 0 ? '+' : ''}${diff.toFixed(2)}%`;
    }
  }, [chart]);

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Acme Advanced</h2>
          <EditMenu align="right" className="relative inline-flex">
            <li>
              <Link className="font-medium text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 flex py-1 px-3" to="#0">Option 1</Link>
            </li>
            <li>
              <Link className="font-medium text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 flex py-1 px-3" to="#0">Option 2</Link>
            </li>
            <li>
              <Link className="font-medium text-sm text-red-500 hover:text-red-600 flex py-1 px-3" to="#0">Remove</Link>
            </li>
          </EditMenu>
        </header>
        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">Sales</div>
        <div className="flex items-start">
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2" ref={chartValue}>$0</div>
          <div className="text-sm font-semibold text-white px-1.5 bg-red-500 rounded-full" ref={chartDeviation}>0%</div>
        </div>
      </div>
      <div className="grow">
        <canvas ref={canvas} width="389" height="128"></canvas>
      </div>
    </div>
  );
}

export default DashboardCard02;