import { MAX_WEIGHT, TOTAL_PERCENTAGE } from "../../config/calculation.config";
import type { LocationWeatherData } from "../../types/types";
import { logger } from "../logger";

export function calculateBaseWeights(weatherData: LocationWeatherData) {
  const { averagePrecipProbability } = weatherData;
  const dryPercentage = TOTAL_PERCENTAGE - averagePrecipProbability;
  const wetPercentage = averagePrecipProbability;

  const dryTotalWeight = (dryPercentage / TOTAL_PERCENTAGE) * MAX_WEIGHT;
  const wetTotalWeight = (wetPercentage / TOTAL_PERCENTAGE) * MAX_WEIGHT;

  logger.log({ dryTotalWeight, wetTotalWeight });
  return { dryTotalWeight, wetTotalWeight };
}
