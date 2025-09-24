import type { LocationWeatherData } from "../../types/types";
import { calculateBaseWeights } from "./base";
import weatherConfig from "../../config/weather.types.json";

export function calculateCloudyConditionWeights(
  weatherData: LocationWeatherData
): {
  [weatherCondition: string]: number;
} {
  const { averageTemperature, averagePrecipProbability } = weatherData;
  const { dryTotalWeight } = calculateBaseWeights(weatherData);
  const sunnyConfig = weatherConfig.dry.sunny[0];
  const cloudyConfig = weatherConfig.dry.cloudy;
  const dryWeights: { [weatherCondition: string]: number } = {};

  if (averageTemperature < 10 || averagePrecipProbability > 30) {
    dryWeights[sunnyConfig] = 0;
  } else {
    dryWeights[sunnyConfig] = Math.round(dryTotalWeight);
  }

  if (averagePrecipProbability > 30) {
    const dividedCloudyWeights = dryTotalWeight / cloudyConfig.length;
    cloudyConfig.forEach(condition => {
      dryWeights[condition] = Math.round(dividedCloudyWeights);
    });
  } else {
    cloudyConfig.forEach(condition => {
      dryWeights[condition] = 0;
    });
  }

  return dryWeights;
}
