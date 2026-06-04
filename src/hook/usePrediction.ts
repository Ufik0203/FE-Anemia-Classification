import { useState } from "react";
import type {
  BatchPredictionResponse,
  PredictionResponse,
} from "../types/prediction";
import { predictFile, predictSingle } from "../service/predictionService";

export const usePrediction = () => {
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [batchResult, setBatchResult] =
    useState<BatchPredictionResponse | null>(null);
  const [uploadedData, setUploadedData] = useState<any[]>([]);
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

  const handleFile = async (data: any[]) => {
    setLoading(true);
    setUploadedData(data);
    try {
      const res = await predictFile(data);
      setBatchResult(res);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const resetAll = () => {
    setResult(null);
    setBatchResult(null);
    setUploadedData([]);
  };

  return {
    result,
    batchResult,
    uploadedData,
    loading,
    handlePredict,
    handleFile,
    resetAll,
  };
};
