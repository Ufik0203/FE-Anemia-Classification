import axios from "axios";
import type {
  BatchPredictionResponse,
  PredictionResponse,
} from "../types/prediction";

const API_URL = import.meta.env.VITE_API_URL;

export const predictSingle = async (
  data: Record<string, number>,
): Promise<PredictionResponse> => {
  const res = await axios.post(`${API_URL}/predict`, data);
  return res.data;
};

export const predictFile = async (
  data: any[],
): Promise<BatchPredictionResponse> => {
  const res = await axios.post(`${API_URL}/predict-file`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res.data;
};

export type MetricsResponse = {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
};

export const getMetrics = async (): Promise<MetricsResponse> => {
  const res = await axios.get(`${API_URL}/metrics`);
  return res.data;
};
