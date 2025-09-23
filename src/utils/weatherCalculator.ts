import type {
  LocationWeatherData,
  RainOptions,
  CalculatedWeights,
} from "../types/types.ts";
import weatherConfig from "../config/weather.types.json";
import {
  MAX_WEIGHT,
  TOTAL_PERCENTAGE,
  RAIN_MODIFIERS,
  LOW_VISIBILITY_MODIFIERS,
} from "../config/calculation.config";
import { logger } from "./logger.ts";

const maxWeight = MAX_WEIGHT;
const totalPercentage = TOTAL_PERCENTAGE;
const rainWeights = RAIN_MODIFIERS;
const lowVisibilityWeights = LOW_VISIBILITY_MODIFIERS;

type LevelWeights = {
  level_1: number;
  level_2: number;
  level_3: number;
};

type ModifierWeights = typeof rainWeights | typeof lowVisibilityWeights;

export function calculateBaseWeights(weatherData: LocationWeatherData) {
  const { averagePrecipProbability } = weatherData;
  const dryPercentage = totalPercentage - averagePrecipProbability;
  const wetPercentage = averagePrecipProbability;

  const dryTotalWeight = (dryPercentage / totalPercentage) * maxWeight;
  const wetTotalWeight = (wetPercentage / totalPercentage) * maxWeight;

  logger.log({ dryTotalWeight, wetTotalWeight });
  return { dryTotalWeight, wetTotalWeight };
}

function getPrecipitationBaseWeights(
  totalPrecipitation: number,
  baseLevelWeights: LevelWeights,
  modifierWeights: ModifierWeights
) {
  if (totalPrecipitation < 200) {
    return {
      level1Weight: Math.round(baseLevelWeights.level_1 * modifierWeights.high),
      level2Weight: Math.round(
        baseLevelWeights.level_2 * modifierWeights.medium
      ),
      level3Weight: Math.round(baseLevelWeights.level_3 * modifierWeights.low),
    };
  } else if (totalPrecipitation <= 400) {
    return {
      level1Weight: Math.round(
        baseLevelWeights.level_1 * modifierWeights.medium
      ),
      level2Weight: Math.round(baseLevelWeights.level_2 * modifierWeights.high),
      level3Weight: Math.round(baseLevelWeights.level_3 * modifierWeights.low),
    };
  } else {
    return {
      level1Weight: Math.round(baseLevelWeights.level_1 * modifierWeights.low),
      level2Weight: Math.round(
        baseLevelWeights.level_2 * modifierWeights.medium
      ),
      level3Weight: Math.round(baseLevelWeights.level_3 * modifierWeights.high),
    };
  }
}

export function calculateRainWeights(
  weatherData: LocationWeatherData,
  options: RainOptions
): CalculatedWeights {
  const { totalPrecipitation } = weatherData;
  const { wetTotalWeight } = calculateBaseWeights(weatherData);

  const finalCalculatedWeights: CalculatedWeights = {};

  (Object.keys(options) as Array<keyof RainOptions>).forEach(rainType => {
    const rainConfig = weatherConfig.wet[rainType];
    if (!options[rainType]) {
      finalCalculatedWeights[rainType] = {
        [rainConfig.levels.level_1[0]]: 0,
        [rainConfig.levels.level_2[0]]: 0,
        [rainConfig.levels.level_3[0]]: 0,
      };
      return;
    }

    const baseWetWeight = {
      level_1: wetTotalWeight,
      level_2: wetTotalWeight,
      level_3: wetTotalWeight,
    };

    const { level1Weight, level2Weight, level3Weight } =
      getPrecipitationBaseWeights(
        totalPrecipitation,
        baseWetWeight,
        rainWeights
      );

    finalCalculatedWeights[rainType] = {
      [rainConfig.levels.level_1[0]]: level1Weight,
      [rainConfig.levels.level_2[0]]: level2Weight,
      [rainConfig.levels.level_3[0]]: level3Weight,
    };
  });

  logger.log(finalCalculatedWeights);
  return finalCalculatedWeights;
}

function calculateLowVisibilityWeights(weatherData: LocationWeatherData): {
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
    getPrecipitationBaseWeights(
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

function calculateCloudyConditionWeights(weatherData: LocationWeatherData): {
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

export function calculateVariables(
  weatherData: LocationWeatherData
): CalculatedWeights {
  const finalCalculatedWeights: CalculatedWeights = {
    low_visibility: calculateLowVisibilityWeights(weatherData),
    dry: calculateCloudyConditionWeights(weatherData),
  };

  logger.log(finalCalculatedWeights);
  return finalCalculatedWeights;
}
// TODO: fix multiple selection not distributing weights
