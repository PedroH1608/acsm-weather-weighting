import type { LocationWeatherData } from "../../types/types";

interface Props {
  weatherData: LocationWeatherData;
}

export function WeatherDataDisplay({ weatherData }: Props) {
  return (
    <div>
      <h2>Weather Data</h2>
      <p>Dominant Wind Direction: {weatherData.averageWindDirection}°</p>
      <p>Maximum Wind Speed: {weatherData.averageMaxWindSpeed}</p>
      <p>Minimum Wind Speed: {weatherData.averageMinWindSpeed}</p>
      <p>Average Temperature: {weatherData.averageTemperature}°C</p>
      <p>Average Precipitation Probability: {weatherData.averagePrecipProbability}%</p>
      <p>Total Precipitation: {weatherData.totalPrecipitation}mm</p>
    </div>
  );
}