import { LOW_VISIBILITY_MODIFIERS } from "../../config/calculation.config";
import type { LocationWeatherData } from "../../types/types";
import { calculateBaseWeights } from "./base";
import weatherConfig from "../../config/weather.types.json";
import { distributeWeightByLevels } from "./shared";

const lowVisibilityWeights = LOW_VISIBILITY_MODIFIERS;

export function calculateLowVisibilityWeights(
  weatherData: LocationWeatherData
): {
  [weatherCondition: string]: number;
} {
  const { averageTemperature, totalPrecipitation } = weatherData;
  const { wetTotalWeight } = calculateBaseWeights(weatherData);
  const lowVisibilityConfig = weatherConfig.low_visibility;

  if (averageTemperature >= 10) {
    return {
      [lowVisibilityConfig.levels.level_1[0]]: 0,
      [lowVisibilityConfig.levels.level_2[0]]: 0,
      [lowVisibilityConfig.levels.level_3[0]]: 0,
    };
  }

  const baseLowVisibilityWeight = {
    level_1: wetTotalWeight,
    level_2: wetTotalWeight,
    level_3: wetTotalWeight,
  };

  const { level1Weight, level2Weight, level3Weight } =
    distributeWeightByLevels(
      totalPrecipitation,
      baseLowVisibilityWeight,
      lowVisibilityWeights
    );

  return {
    [lowVisibilityConfig.levels.level_1[0]]: level1Weight,
    [lowVisibilityConfig.levels.level_2[0]]: level2Weight,
    [lowVisibilityConfig.levels.level_3[0]]: level3Weight,
  };
}
