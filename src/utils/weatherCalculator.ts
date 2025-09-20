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

type CalculatedWeights = {
  [rainType: string]: {
    [weatherCondition: string]: number;
  };
};

export function handleCalculate(
  weatherData: LocationWeatherData,
  options: RainOptions
): CalculatedWeights {
  const { totalPrecipitation } = weatherData;

  const finalCalculatedWeights: CalculatedWeights = {};

  (Object.keys(options) as Array<keyof RainOptions>).forEach((rainType) => {
    if (options[rainType]) return;

    const rainConfig = weatherConfig.wet[rainType];
    const baseWetWeight = baseWeights.wet[rainType];
    let level1Weight, level2Weight, level3Weight;

    if (totalPrecipitation < 200) {
      level1Weight = baseWetWeight.level_1 + rainWeights.high;
      level2Weight = baseWetWeight.level_2 + rainWeights.medium;
      level3Weight = baseWetWeight.level_3 + rainWeights.low;
    } else if (totalPrecipitation <= 400) {
      level1Weight = baseWetWeight.level_1 + rainWeights.medium;
      level2Weight = baseWetWeight.level_2 + rainWeights.high;
      level3Weight = baseWetWeight.level_3 + rainWeights.low;
    } else {
      level1Weight = baseWetWeight.level_1 + rainWeights.low;
      level2Weight = baseWetWeight.level_2 + rainWeights.medium;
      level3Weight = baseWetWeight.level_3 + rainWeights.high;
    }

    finalCalculatedWeights[rainType] = {
      [rainConfig.levels.level_1[0]]: level1Weight,
      [rainConfig.levels.level_2[0]]: level2Weight,
      [rainConfig.levels.level_3[0]]: level3Weight,
    };
  });

  console.log("Final Calculated Weights:", finalCalculatedWeights);
  return finalCalculatedWeights;
}

export function calculateVariables(weatherData: LocationWeatherData) {
  const { averageTemperature, averagePrecipProbability } = weatherData;

  if (averageTemperature < 10) {
    console.log("averageTemperature < 10");
  }

  if (averagePrecipProbability > 30) {
    console.log("averagePrecipProbability > 30");
  }
}
