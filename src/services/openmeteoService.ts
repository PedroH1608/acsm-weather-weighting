import { fetchWeatherApi } from "openmeteo";
import type { LocationWeatherData } from "../types/types.ts";
import { logger } from "../utils/logger.ts";

export async function getWeatherData(coords: {
  latitude: number;
  longitude: number;
}): Promise<LocationWeatherData[]> {
  const params = {
    latitude: [coords.latitude],
    longitude: [coords.longitude],
    daily: [
      "wind_direction_10m_dominant",
      "wind_speed_10m_max",
      "wind_speed_10m_min",
      "temperature_2m_mean",
      "precipitation_probability_mean",
      "precipitation_sum",
    ],
    timezone: "auto",
    past_days: 90,
  };

  const url = "https://api.open-meteo.com/v1/forecast";
  const responses = await fetchWeatherApi(url, params);
  const results: LocationWeatherData[] = [];

  for (const response of responses) {
    const latitude = response.latitude();
    const longitude = response.longitude();
    const daily = response.daily()!;

    const weatherData = {
      daily: {
        wind_direction_10m_dominant: Array.from(
          daily.variables(0)?.valuesArray() ?? []
        ).filter((value) => !isNaN(value)),
        wind_speed_10m_max: Array.from(
          daily.variables(1)?.valuesArray() ?? []
        ).filter((value) => !isNaN(value)),
        wind_speed_10m_min: Array.from(
          daily.variables(2)?.valuesArray() ?? []
        ).filter((value) => !isNaN(value)),
        temperature_2m_mean: Array.from(
          daily.variables(3)?.valuesArray() ?? []
        ).filter((value) => !isNaN(value)),
        precipitation_probability_mean: Array.from(
          daily.variables(4)?.valuesArray() ?? []
        ).filter((value) => !isNaN(value)),
        precipitation_sum: Array.from(
          daily.variables(5)?.valuesArray() ?? []
        ).filter((value) => !isNaN(value)),
      },
    };

    logger.log("\nDaily data", weatherData.daily);

    const windDirections = weatherData.daily.wind_direction_10m_dominant;
    const averageWindDirection =
      windDirections.reduce((sum, dir) => sum + dir, 0) / windDirections.length;

    const maxWindSpeeds = weatherData.daily.wind_speed_10m_max;
    const averageMaxWindSpeed =
      maxWindSpeeds.reduce((sum, speed) => sum + speed, 0) /
      maxWindSpeeds.length;

    const minWindSpeeds = weatherData.daily.wind_speed_10m_min;
    const averageMinWindSpeed =
      minWindSpeeds.reduce((sum, speed) => sum + speed, 0) /
      minWindSpeeds.length;

    const temperatures = weatherData.daily.temperature_2m_mean;
    const averageTemperature =
      temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length;

    const precipProbabilities =
      weatherData.daily.precipitation_probability_mean;
    const averagePrecipProbability =
      precipProbabilities.reduce((sum, prob) => sum + prob, 0) /
      precipProbabilities.length;

    const precipSum = weatherData.daily.precipitation_sum;
    const totalPrecipitation = precipSum.reduce(
      (sum, precip) => sum + precip,
      0
    );

    results.push({
      latitude,
      longitude,
      averageWindDirection: Math.round(averageWindDirection),
      averageMaxWindSpeed: Math.round(averageMaxWindSpeed),
      averageMinWindSpeed: Math.round(averageMinWindSpeed),
      averageTemperature: Math.round(averageTemperature),
      averagePrecipProbability: Math.round(averagePrecipProbability),
      totalPrecipitation: Math.round(totalPrecipitation),
    });
  }
  return results;
}
