import type {
  LocationWeatherData,
  RainOptions,
  CalculatedWeights,
} from "../../types/types.ts";
import weatherConfig from "../../config/weather.types.json";
import { logger } from "../logger";
import { calculateBaseWeights } from "./base";
import { distributeWeightByLevels } from "./shared.ts";
import { RAIN_MODIFIERS } from "../../config/calculation.config.ts";

const rainWeights = RAIN_MODIFIERS;

export function calculateRainWeights(
  weatherData: LocationWeatherData,
  options: RainOptions
): CalculatedWeights {
  const { totalPrecipitation } = weatherData;
  const { wetTotalWeight } = calculateBaseWeights(weatherData);

  const finalCalculatedWeights: CalculatedWeights = {};

  const selectedRainTypes = (
    Object.keys(options) as Array<keyof RainOptions>
  ).filter(key => options[key]);

  const rainTypeWeights: Partial<Record<keyof RainOptions, number>> = {};

  if (selectedRainTypes.length > 1) {
    const rainHierarchy: (keyof RainOptions)[] = [
      "light_rain",
      "rain",
      "heavy_rain",
    ];
    const modifierValues = [
      RAIN_MODIFIERS.high,
      RAIN_MODIFIERS.medium,
      RAIN_MODIFIERS.low,
    ];

    let primaryIndex: number;
    if (totalPrecipitation < 200) {
      primaryIndex = 0;
    } else if (totalPrecipitation <= 400) {
      primaryIndex = 1;
    } else {
      primaryIndex = 2;
    }

    const scores: Partial<Record<keyof RainOptions, number>> = {};
    rainHierarchy.forEach((rainType, index) => {
      const distance = Math.abs(index - primaryIndex);
      scores[rainType] = modifierValues[distance] ?? 0;
    });

    const totalScore = selectedRainTypes.reduce(
      (sum, rainType) => sum + (scores[rainType] ?? 0),
      0
    );

    selectedRainTypes.forEach(rainType => {
      const rainTypeScore = scores[rainType] ?? 0;
      rainTypeWeights[rainType] =
        totalScore > 0 ? wetTotalWeight * (rainTypeScore / totalScore) : 0;
    });
  } else if (selectedRainTypes.length === 1) {
    rainTypeWeights[selectedRainTypes[0]] = wetTotalWeight;
  }

  (Object.keys(options) as Array<keyof RainOptions>).forEach(rainType => {
    const rainConfig = weatherConfig.wet[rainType];
    const rainTypeTotalWeight = rainTypeWeights[rainType] ?? 0;

    if (rainTypeTotalWeight === 0) {
      finalCalculatedWeights[rainType] = {
        [rainConfig.levels.level_1[0]]: 0,
        [rainConfig.levels.level_2[0]]: 0,
        [rainConfig.levels.level_3[0]]: 0,
      };
      return;
    }

    const baseWetWeight = {
      level_1: rainTypeTotalWeight,
      level_2: rainTypeTotalWeight,
      level_3: rainTypeTotalWeight,
    };

    const { level1Weight, level2Weight, level3Weight } =
      distributeWeightByLevels(totalPrecipitation, baseWetWeight, rainWeights);

    finalCalculatedWeights[rainType] = {
      [rainConfig.levels.level_1[0]]: level1Weight,
      [rainConfig.levels.level_2[0]]: level2Weight,
      [rainConfig.levels.level_3[0]]: level3Weight,
    };
  });

  logger.log(finalCalculatedWeights);
  return finalCalculatedWeights;
}
