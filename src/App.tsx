import { useState, type FormEvent } from "react";
import {
  calculateRainWeights,
  calculateVariables,
} from "./utils/weatherCalculator";
import { useWeather } from "./hooks/useWeather";
import type { RainOptions, CalculatedWeights } from "./types/types";
import { logger } from "./utils/logger";

function App() {
  const [location, setLocation] = useState("");
  const { weatherData, loading, error, fetchWeatherData } = useWeather();

  const [lightRain, setLightRain] = useState(false);
  const [rain, setRain] = useState(false);
  const [heavyRain, setHeavyRain] = useState(false);

  const [isCalculating, setIsCalculating] = useState(false);
  const [results, setResults] = useState<CalculatedWeights | null>(null);

  const handleSearch = () => {
    fetchWeatherData(location);
    setResults(null);
  };

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!weatherData) {
      alert("Please search for a location's weather data first.");
      return;
    }

    setIsCalculating(true);
    setResults(null);

    try {
      const rainOptions: RainOptions = {
        light_rain: lightRain,
        rain: rain,
        heavy_rain: heavyRain,
      };

      const rainResults = calculateRainWeights(weatherData, rainOptions);
      const otherResults = calculateVariables(weatherData);
      const finalResults = { ...otherResults, ...rainResults };
      setResults(finalResults);
    } catch (error) {
      logger.error("Error calculating rain weights:", error);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <>
      <div>
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <input
            type='text'
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder='Ex: Interlagos, Brazil'
          />
          <button type='submit'>Search</button>
        </form>
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
            <h3>Rain Options:</h3>
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

          {isCalculating && <p>Calculating rain weights...</p>}

          {results && (
            <div>
              <h3>Calculation Results:</h3>
              {Object.entries(results).map(([group, conditions]) => (
                <div key={group}>
                  <h4>{group.replace(/_/g, " ").toUpperCase()}</h4>
                  <ul>
                    {Object.entries(conditions).map(([condition, weight]) => (
                      <li key={condition}>
                        {condition}: {weight}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default App;
