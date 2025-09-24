import type { CalculatedWeights } from "../../types/types";

interface Props {
  results: CalculatedWeights;
}

export function ResultsDisplay({ results }: Props) {
  return (
    <div>
      <h2>Calculation Results</h2>
      <pre>{JSON.stringify(results, null, 2)}</pre>
    </div>
  );
}

// TODO: add JSON download button