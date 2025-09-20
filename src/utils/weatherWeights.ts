// filepath: src/logic/weatherWeights.ts
export const baseWeights = {
  dry: {
    sunny: 10,
    cloudy: 10,
  },
  wet: {
    light_rain: {
      level_1: 10,
      level_2: 10,
      level_3: 10,
    },
    rain: {
      level_1: 10,
      level_2: 10,
      level_3: 10,
    },
    heavy_rain: {
      level_1: 10,
      level_2: 10,
      level_3: 10,
    },
  },
  low_visibility: 10,
};