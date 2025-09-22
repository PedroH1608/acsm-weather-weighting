import weatherConfig from "../config/weather.types.json";

export interface LocationWeatherData {
  latitude: number;
  longitude: number;
  averageWindDirection: number;
  averageMaxWindSpeed: number;
  averageMinWindSpeed: number;
  averageTemperature: number;
  averagePrecipProbability: number;
  totalPrecipitation: number;
}

export type RainOptions = Partial<
  Record<keyof typeof weatherConfig.wet, boolean>
>;

export type CalculatedWeights = {
  [rainType: string]: {
    [weatherCondition: string]: number;
  };
};