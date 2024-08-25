import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DashboardCard07() {
  const [weatherStations, setWeatherStations] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/weather_stations/', {
      headers: {
        'Accept': 'application/json',
      }
    })
      .then(response => {
        if (Array.isArray(response.data)) {
          setWeatherStations(response.data);
          setLastUpdated(new Date());
        } else {
          setError('Unexpected data format: Expected an array');
        }
      })
      .catch(error => {
        setError('Error fetching data: ' + error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="col-span-full xl:col-span-12 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-span-full xl:col-span-12 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8">
        <div className="text-center py-8 text-red-600 font-semibold">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-full xl:col-span-12 bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">All Weather Stations</h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {lastUpdated.toLocaleDateString()} at {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </header>
      <div className="p-3">
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 rounded-sm">
              <tr>
                <th className="p-2"><div className="font-semibold text-left">Weather Station</div></th>
                <th className="p-2"><div className="font-semibold text-center">Temperature</div></th>
                <th className="p-2"><div className="font-semibold text-center">Wind Speed</div></th>
                <th className="p-2"><div className="font-semibold text-center">Wind Direction</div></th>
                <th className="p-2"><div className="font-semibold text-center">Humidity</div></th>
                <th className="p-2"><div className="font-semibold text-center">Precipitation</div></th>
                <th className="p-2"><div className="font-semibold text-center">Solar Radiation</div></th>
                <th className="p-2"><div className="font-semibold text-center">UV Index</div></th>
                <th className="p-2"><div className="font-semibold text-center">Barometric Pressure</div></th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700">
              {weatherStations.length > 0 ? (
                weatherStations.map((station, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-150">
                    <td className="p-2">
                      <div className="flex items-center">
                        <div className="text-gray-800 dark:text-gray-100 font-medium">{station.name}</div>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="text-center text-green-500 font-semibold">{station.temperature}°C</div>
                    </td>
                    <td className="p-2">
                      <div className="text-center text-blue-500 font-semibold">{station.wind_speed} km/h</div>
                    </td>
                    <td className="p-2">
                      <div className="text-center text-purple-500 font-semibold">{station.wind_direction}°</div>
                    </td>
                    <td className="p-2">
                      <div className="text-center text-yellow-500 font-semibold">{station.humidity}%</div>
                    </td>
                    <td className="p-2">
                      <div className="text-center text-blue-400 font-semibold">{station.precipitation} mm</div>
                    </td>
                    <td className="p-2">
                      <div className="text-center text-orange-500 font-semibold">{station.solar_radiation} W/m²</div>
                    </td>
                    <td className="p-2">
                      <div className="text-center text-pink-500 font-semibold">{station.uv_index}</div>
                    </td>
                    <td className="p-2">
                      <div className="text-center text-indigo-500 font-semibold">{station.barometric_pressure} hPa</div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center p-4 text-gray-500 dark:text-gray-400">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard07;