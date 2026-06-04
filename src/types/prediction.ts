export type PredictionResponse = {
  label: string;
  confidence: number;
  probabilities: Record<string, number>;
};

export type BatchPredictionItem = {
  row: number;
  diagnosis: string;
  confidence: number;
  probabilities: Record<string, number>;
};

export type BatchPredictionResponse = {
  total: number;
  results: BatchPredictionItem[];
};