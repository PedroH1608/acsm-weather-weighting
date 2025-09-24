import { useState } from "react";
import { useWeather } from "./hooks/useWeather";
import type { CalculatedWeights, RainOptions } from "./types/types.ts";
import { calculateRainWeights } from "./utils/calculations/rain";
import { calculateAmbientWeights } from "./utils/weatherProcessor";

import { Header } from "./components/organisms/Header.tsx";
import { WeatherDataDisplay } from "./components/organisms/WeatherDataDisplay.tsx";
import { CalculationForm } from "./components/organisms/CalculationForm";
import { ResultsDisplay } from "./components/organisms/ResultDisplay.tsx";

function App() {
  const [location, setLocation] = useState("");
  const { weatherData, loading, error, fetchWeatherData } = useWeather();
  const [isCalculating, setIsCalculating] = useState(false);
  const [results, setResults] = useState<CalculatedWeights | null>(null);

  const handleSearch = () => {
    fetchWeatherData(location);
    setResults(null);
  };

  const handleFormSubmit = (options: RainOptions) => {
    if (!weatherData) return;
    setIsCalculating(true);

    setTimeout(() => {
      const rainResults = calculateRainWeights(weatherData, options);
      const otherResults = calculateAmbientWeights(weatherData);
      setResults({ ...rainResults, ...otherResults });
      setIsCalculating(false);
    }, 500);
  };

  return (
    <>
      <Header
        title='ACSM Weather Weighting'
        location={location}
        onLocationChange={setLocation}
        onSearch={handleSearch}
        isLoading={loading}
      />
      {error && <p>{error}</p>}
      {weatherData && (
        <div>
          <WeatherDataDisplay weatherData={weatherData} />
          <CalculationForm
            onSubmit={handleFormSubmit}
            isCalculating={isCalculating}
          />
        </div>
      )}
      {results && <ResultsDisplay results={results} />}
    </>
  );
}

export default App;
