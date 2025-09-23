import { useState } from "react";
import { getWeatherData } from "../services/openmeteoService";
import { getWeatherLocation } from "../services/geoCodingService";
import type { LocationWeatherData } from "../types/types.ts";
import { logger } from "../utils/logger.ts";

export const useWeather = () => {
  const [weatherData, setWeatherData] = useState<LocationWeatherData | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = async (location: string) => {
    if (!location) return;

    setLoading(true);
    setError(null);
    setWeatherData(null);

    try {
      const coordinates = await getWeatherLocation(location);
      if (coordinates) {
        const data = await getWeatherData(coordinates);
        if (data.length > 0) {
          setWeatherData(data[0]);
        } else {
          setError("No weather data found for this location.");
        }
      } else {
        setError("Location not found.");
      }
    } catch (err) {
      setError("An error occurred while fetching data.");
      logger.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return { weatherData, loading, error, fetchWeatherData };
};
