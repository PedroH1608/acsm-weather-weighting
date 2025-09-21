import type { LocationWeatherData } from "../types/types.ts";
import weatherConfig from "../config/weather.types.json";
import { baseWeights } from "./weatherWeights";

export type RainOptions = Partial<
  Record<keyof typeof weatherConfig.wet, boolean>
>;

const rainWeights = {
  high: 3,
  medium: 2,
  low: 1,
};

const lowVisibilityWeights = {
  high: 3,
  medium: 2,
  low: 1,
};

type CalculatedWeights = {
  [rainType: string]: {
    [weatherCondition: string]: number;
  };
};

type LevelWeights = {
  level_1: number;
  level_2: number;
  level_3: number;
};

type ModifierWeights = typeof rainWeights | typeof lowVisibilityWeights;

function getPrecipitationBasedWeights(
  totalPrecipitation: number,
  baseLevelWeights: LevelWeights,
  modifierWeights: ModifierWeights
) {
  if (totalPrecipitation < 200) {
    return {
      level1Weight: baseLevelWeights.level_1 + modifierWeights.high,
      level2Weight: baseLevelWeights.level_2 + modifierWeights.medium,
      level3Weight: baseLevelWeights.level_3 + modifierWeights.low,
    };
  } else if (totalPrecipitation <= 400) {
    return {
      level1Weight: baseLevelWeights.level_1 + modifierWeights.medium,
      level2Weight: baseLevelWeights.level_2 + modifierWeights.high,
      level3Weight: baseLevelWeights.level_3 + modifierWeights.low,
    };
  } else {
    return {
      level1Weight: baseLevelWeights.level_1 + modifierWeights.low,
      level2Weight: baseLevelWeights.level_2 + modifierWeights.medium,
      level3Weight: baseLevelWeights.level_3 + modifierWeights.high,
    };
  }
}

export function handleCalculate(
  weatherData: LocationWeatherData,
  options: RainOptions
): CalculatedWeights {
  const { totalPrecipitation } = weatherData;

  const finalCalculatedWeights: CalculatedWeights = {};

  (Object.keys(options) as Array<keyof RainOptions>).forEach((rainType) => {
    if (!options[rainType]) return;

    const rainConfig = weatherConfig.wet[rainType];
    const baseWetWeight = baseWeights.wet[rainType];

    const { level1Weight, level2Weight, level3Weight } =
      getPrecipitationBasedWeights(
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

  console.log("Final Calculated Weights:", finalCalculatedWeights);
  return finalCalculatedWeights;
}

export function calculateVariables(
  weatherData: LocationWeatherData
): CalculatedWeights {
  const { averageTemperature, totalPrecipitation, averagePrecipProbability } =
    weatherData;

  const finalCalculatedWeights: CalculatedWeights = {};

  const lowVisibilityConfig = weatherConfig.low_visibility;
  const baseLowVisibilityWeight = baseWeights.low_visibility;
  const sunnyConfig = weatherConfig.dry.sunny[0];

  if (averageTemperature < 10) {
    console.log("averageTemperature < 10");
    const { level1Weight, level2Weight, level3Weight } =
      getPrecipitationBasedWeights(
        totalPrecipitation,
        baseLowVisibilityWeight,
        lowVisibilityWeights
      );

    finalCalculatedWeights.low_visibility = {
      [lowVisibilityConfig.levels.level_1[0]]: level1Weight,
      [lowVisibilityConfig.levels.level_2[0]]: level2Weight,
      [lowVisibilityConfig.levels.level_3[0]]: level3Weight,
    };

    finalCalculatedWeights.dry = {
      [sunnyConfig]: 0,
    };
  } else {
    console.log("averageTemperature >= 10.");

    finalCalculatedWeights.low_visibility = {
      [lowVisibilityConfig.levels.level_1[0]]: 0,
      [lowVisibilityConfig.levels.level_2[0]]: 0,
      [lowVisibilityConfig.levels.level_3[0]]: 0,
    };

    finalCalculatedWeights.dry = {
      [sunnyConfig]: baseWeights.dry.sunny,
    };
  }

  if (averagePrecipProbability > 30) {
    console.log("averagePrecipProbability > 30");

    finalCalculatedWeights.dry = {
      [sunnyConfig]: 0,
    };
  } else {
    console.log("averagePrecipProbability <= 30");
  }

  console.log(finalCalculatedWeights);
  return finalCalculatedWeights;
}
