import type { LocationWeatherData, CalculatedWeights } from "../types/types.ts";
import { calculateCloudyConditionWeights } from "./calculations/dry.ts";
import { calculateLowVisibilityWeights } from "./calculations/visibility.ts";
import { logger } from "./logger.ts";

export function calculateAmbientWeights(
  weatherData: LocationWeatherData
): CalculatedWeights {
  const finalCalculatedWeights: CalculatedWeights = {
    low_visibility: calculateLowVisibilityWeights(weatherData),
    dry: calculateCloudyConditionWeights(weatherData),
  };

  logger.log(finalCalculatedWeights);
  return finalCalculatedWeights;
}
