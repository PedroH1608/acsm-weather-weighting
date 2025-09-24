type LevelWeights = {
  level_1: number;
  level_2: number;
  level_3: number;
};

type ModifierWeights = {
  high: number;
  medium: number;
  low: number;
};

export function distributeWeightByLevels(
  value: number,
  baseLevelWeights: LevelWeights,
  modifierWeights: ModifierWeights
) {
  if (value < 200) {
    return {
      level1Weight: Math.round(baseLevelWeights.level_1 * modifierWeights.high),
      level2Weight: Math.round(baseLevelWeights.level_2 * modifierWeights.medium),
      level3Weight: Math.round(baseLevelWeights.level_3 * modifierWeights.low),
    };
  } else if (value <= 400) {
    return {
      level1Weight: Math.round(baseLevelWeights.level_1 * modifierWeights.medium),
      level2Weight: Math.round(baseLevelWeights.level_2 * modifierWeights.high),
      level3Weight: Math.round(baseLevelWeights.level_3 * modifierWeights.low),
    };
  } else {
    return {
      level1Weight: Math.round(baseLevelWeights.level_1 * modifierWeights.low),
      level2Weight: Math.round(baseLevelWeights.level_2 * modifierWeights.medium),
      level3Weight: Math.round(baseLevelWeights.level_3 * modifierWeights.high),
    };
  }
}