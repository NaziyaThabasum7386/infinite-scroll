import React from 'react';
import { format } from 'date-fns';
import styles from './WeatherApp.module.css';
import backgroundImage from './assets/bg.jpg';

interface WeatherAppProps {
  cityName: string;
  weatherData: any;
  onBack: () => void;
}

const WeatherApp: React.FC<WeatherAppProps> = ({ cityName, weatherData, onBack }) => {
  const tempCelsius = weatherData.main.temp;
  const feelsLike = weatherData.main.feels_like;
  const minTemp = weatherData.main.temp_min;
  const maxTemp = weatherData.main.temp_max;
  const pressure = weatherData.main.pressure;
  const humidity = weatherData.main.humidity;
  const visibility = weatherData.visibility / 1000; // Convert to kilometers
  const windSpeed = weatherData.wind.speed;
  const windDirection = weatherData.wind.deg;
  const description = weatherData.weather[0].description;
  const cloudiness = weatherData.clouds.all; // Percentage of cloud cover
  const rainVolume = weatherData.rain ? weatherData.rain['1h'] : 0; // Rain volume for last hour

  const formattedDate = format(new Date(), 'MMMM dd, yyyy');

  return (
    <div className={styles.weatherApp} style={{ backgroundImage: `url(${backgroundImage})` }}>
      <button onClick={onBack} className={`${styles.backButton} ${styles.blueButton}`}>Go Back</button>
      <div className={styles.cityBox}>
        <h2>{cityName}</h2>
        <p>Today, {formattedDate}</p>
      </div>
      <div className={styles.weatherDetails}>
        <div className={styles.weatherDetail}><p><strong>Temperature:</strong> {tempCelsius.toFixed(1)}°C (Feels like {feelsLike.toFixed(1)}°C)</p></div>
        <div className={styles.weatherDetail}><p><strong>Min/Max Temp:</strong> {minTemp.toFixed(1)}°C / {maxTemp.toFixed(1)}°C</p></div>
        <div className={styles.weatherDetail}><p><strong>Pressure:</strong> {pressure} hPa</p></div>
        <div className={styles.weatherDetail}><p><strong>Humidity:</strong> {humidity}%</p></div>
        <div className={styles.weatherDetail}><p><strong>Visibility:</strong> {visibility} km</p></div>
        <div className={styles.weatherDetail}><p><strong>Wind:</strong> {windSpeed} m/s at {windDirection}°</p></div>
        <div className={styles.weatherDetail}><p><strong>Cloudiness:</strong> {cloudiness}%</p></div>
        <div className={styles.weatherDetail}><p><strong>Rain Volume:</strong> {rainVolume} mm (last hour)</p></div>
        <div className={styles.weatherDetail}><p><strong>Weather Description:</strong> {description}</p></div>
      </div>
    </div>
  );
};

export default WeatherApp;
