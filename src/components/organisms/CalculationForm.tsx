import React, { useState } from "react";
import type { RainOptions } from "../../types/types";

interface Props {
  onSubmit: (options: RainOptions) => void;
  isCalculating: boolean;
}

const initialOptions: RainOptions = {
  light_rain: false,
  rain: false,
  heavy_rain: false,
};

export function CalculationForm({ onSubmit, isCalculating }: Props) {
  const [rainOptions, setRainOptions] = useState<RainOptions>(initialOptions);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setRainOptions(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(rainOptions);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Select Rain Types to Calculate</h3>
      <div>
        <label>
          <input
            type='checkbox'
            name='light_rain'
            checked={rainOptions.light_rain}
            onChange={handleCheckboxChange}
          />
          Light Rain
        </label>
      </div>
      <div>
        <label>
          <input
            type='checkbox'
            name='rain'
            checked={rainOptions.rain}
            onChange={handleCheckboxChange}
          />
          Rain
        </label>
      </div>
      <div>
        <label>
          <input
            type='checkbox'
            name='heavy_rain'
            checked={rainOptions.heavy_rain}
            onChange={handleCheckboxChange}
          />
          Heavy Rain
        </label>
      </div>
      <button type='submit' disabled={isCalculating}>
        {isCalculating ? "Calculating..." : "Calculate Weights"}
      </button>
    </form>
  );
}
