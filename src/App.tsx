import { useState, type FormEvent } from "react";
import { calculateRainWeights, calculateVariables, calculateBaseWeights } from "./utils/weatherCalculator";
import { useWeather } from "./hooks/useWeather";
import type { RainOptions } from "./types/types";

function App() {
  const [location, setLocation] = useState("");
  const { weatherData, loading, error, fetchWeatherData } = useWeather();

  const [lightRain, setLightRain] = useState(false);
  const [rain, setRain] = useState(false);
  const [heavyRain, setHeavyRain] = useState(false);

  const handleSearch = () => {
    fetchWeatherData(location);
  };

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!weatherData) {
      alert("Please search for a location's weather data first.");
      return;
    }

    const rainOptions: RainOptions = {
      light_rain: lightRain,
      rain: rain,
      heavy_rain: heavyRain,
    };

    calculateRainWeights(weatherData, rainOptions);
    calculateVariables(weatherData);
    console.log(calculateBaseWeights(weatherData));

    alert("Calculation complete");
  };

  return (
    <>
      <div>
        <input
          type='text'
          value={location}
          onChange={e => setLocation(e.target.value)}
          placeholder='Ex: Interlagos, Brazil'
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {loading && <p>Loading weather data...</p>}
      {error && <p>{error}</p>}
      {weatherData && (
        <div>
          <h2>
            Location: {weatherData.latitude.toFixed(2)}°N,{" "}
            {weatherData.longitude.toFixed(2)}°E
          </h2>
          <p>Dominant Wind Direction: {weatherData.averageWindDirection}°</p>
          <p>Maximum Wind Speed: {weatherData.averageMaxWindSpeed}</p>
          <p>Minimum Wind Speed: {weatherData.averageMinWindSpeed}</p>
          <p>Average Temperature: {weatherData.averageTemperature}°C</p>
          <p>
            Average Precipitation Probability:{" "}
            {weatherData.averagePrecipProbability}%
          </p>
          <p>Total Precipitation: {weatherData.totalPrecipitation}mm</p>

          <form onSubmit={handleFormSubmit}>
            <h3>Rain Options to Apply:</h3>
            <div>
              <input
                type='checkbox'
                id='lightRain'
                checked={lightRain}
                onChange={e => setLightRain(e.target.checked)}
              />
              <label htmlFor='lightRain'>Light Rain (Drizzle)</label>
            </div>
            <div>
              <input
                type='checkbox'
                id='rain'
                checked={rain}
                onChange={e => setRain(e.target.checked)}
              />
              <label htmlFor='rain'>Rain</label>
            </div>
            <div>
              <input
                type='checkbox'
                id='heavyRain'
                checked={heavyRain}
                onChange={e => setHeavyRain(e.target.checked)}
              />
              <label htmlFor='heavyRain'>Heavy Rain (Thunderstorm)</label>
            </div>
            <button type='submit'>Submit</button>
          </form>
        </div>
      )}
    </>
  );
}

export default App;
