import axios from "axios";
import type { BatchPredictionResponse, PredictionResponse } from "../types/prediction";


const API_URL = import.meta.env.VITE_API_URL;

export const predictSingle = async (
  data: Record<string, number>,
): Promise<PredictionResponse> => {
  const res = await axios.post(`${API_URL}/predict`, data);
  return res.data;
};

export const predictFile = async (
  file: File,
): Promise<BatchPredictionResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(`${API_URL}/predict-file`, formData);
  return res.data;
};

export type MetricsResponse = {
  accuracy: number;
  precision_macro: number;
  recall_macro: number;
  f1_macro: number;
};

export const getMetrics = async (): Promise<MetricsResponse> => {
  const res = await axios.get(`${API_URL}/metrics`);
  return res.data;
};