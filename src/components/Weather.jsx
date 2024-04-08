// Weather.jsx
import React, { useState, useEffect } from 'react';

const Weather = () => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    // Function to fetch weather data
    const fetchWeatherData = (position) => {
      const API_KEY = "44bcd249b512a9b55d71c9ef0499c039";
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error('Weather data could not be fetched.');
          }
          return response.json();
        })
        .then(data => setWeather(data))
        .catch(error => console.error("Error fetching weather data:", error));
    };

    // Function to handle location error
    const handleLocationError = (error) => {
      console.error('Error getting user location:', error.message);
    };

    // Get user's current location and fetch weather data
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(fetchWeatherData, handleLocationError);
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  if (!weather) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Weather Details :</h2>
      <p><strong>Location:</strong> {weather.name}</p>
      <p><strong>Temperature:</strong> {weather.main.temp}°C</p>
      <p><strong>Condition:</strong> {weather.weather[0].main}</p>
      <p><strong>Humidity:</strong> {weather.main.humidity}%</p>
    </div>
  );
};

export default Weather;
