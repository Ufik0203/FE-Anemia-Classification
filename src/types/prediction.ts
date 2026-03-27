export type PredictionResponse = {
  label: string;
  confidence: number;
  probabilities: Record<string, number>;
};

export type BatchPredictionItem = {
  label: string;
  confidence: number;
  probabilities: Record<string, number>;
};

export type BatchPredictionResponse = {
  results: BatchPredictionItem[];
};
