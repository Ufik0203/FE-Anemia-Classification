import { useState } from "react";
import type { BatchPredictionResponse, PredictionResponse } from "../types/prediction";
import { predictFile, predictSingle } from "../service/predictionService";


export const usePrediction = () => {
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [batchResult, setBatchResult] =
    useState<BatchPredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async (data: Record<string, number>) => {
    setLoading(true);
    try {
      const res = await predictSingle(data);
      setResult(res);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleFile = async (file: File) => {
    setLoading(true);
    try {
      const res = await predictFile(file);
      setBatchResult(res);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return {
    result,
    batchResult,
    loading,
    handlePredict,
    handleFile,
  };
};
