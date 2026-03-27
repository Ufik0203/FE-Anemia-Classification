import { useEffect, useState } from "react";
import { getMetrics, type MetricsResponse } from "../service/predictionService";

export default function ResultPanel({ result, loading }: any) {
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);

  useEffect(() => {
    getMetrics()
      .then(setMetrics)
      .catch((err) => console.error(err));
  }, []);

  const toPercent = (val: number) => `${(val * 100).toFixed(2)}%`;
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold text-blue-500 mb-3">Hasil Diagnosis</h2>

      <div className="border p-3 rounded mb-4">
        {loading ? "Loading..." : result?.label || "Belum ada hasil"}
      </div>

      {result && (
        <>
          <p className="mb-2">
            Confidence: <b>{(result.confidence * 100).toFixed(2)}%</b>
          </p>

          <div className="space-y-1 mb-4">
            {Object.entries(result.probabilities).map(([k, v]: any) => (
              <div key={k} className="text-sm">
                {k}: {(v * 100).toFixed(2)}%
              </div>
            ))}
          </div>
        </>
      )}

      <h2 className="text-green-600 font-bold mb-2">Evaluasi Terbaik</h2>

      <div className="grid grid-cols-4 text-center text-sm">
        <div>
          <p className="text-red-500">Accuracy</p>
          <b>{metrics ? toPercent(metrics.accuracy) : "-"}</b>
        </div>
        <div>
          <p className="text-red-500">Precision</p>
          <b>{metrics ? toPercent(metrics.precision_macro) : "-"}</b>
        </div>
        <div>
          <p className="text-red-500">Recall</p>
          <b>{metrics ? toPercent(metrics.recall_macro) : "-"}</b>
        </div>
        <div>
          <p className="text-red-500">F1</p>
          <b>{metrics ? toPercent(metrics.f1_macro) : "-"}</b>
        </div>
      </div>
    </div>
  );
}
