import { useEffect, useState } from "react";

import { getMetrics, type MetricsResponse } from "../service/predictionService";

import { exportPredictionPdf } from "../utils/exportPdf";

export default function ResultPanel({
  result,
  batchResult,
  uploadedData,
  loading,
  resetSignal,
}: any) {
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);

  useEffect(() => {
    getMetrics().then(setMetrics).catch(console.error);
  }, []);

  useEffect(() => {}, [resetSignal]);

  const toPercent = (val: number) => `${(val * 100).toFixed(2)}%`;

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold text-blue-500 mb-4">Hasil Diagnosis</h2>

      {loading && <div className="border rounded p-3 mb-4">Loading...</div>}

      {result && !loading && (
        <>
          <div className="border rounded p-3 mb-4 font-semibold">
            {result.label}
          </div>

          {/* <p className="mb-2">
            Confidence: <b>{toPercent(result.confidence)}</b>
          </p> */}

          {/* <div className="space-y-1 mb-4">
            {Object.entries(result.probabilities).map(([key, value]: any) => (
              <div key={key} className="text-sm">
                {key}: {toPercent(value)}
              </div>
            ))}
          </div> */}
        </>
      )}

      {batchResult && (
        <>
          <div className="border rounded p-4 mb-4">
            <h3 className="font-bold mb-2">Hasil Prediksi File</h3>

            <p>
              Total Data: <b>{batchResult.total}</b>
            </p>
          </div>

          <div className="max-h-60 overflow-auto border rounded mb-4">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-1">No</th>
                  <th className="border px-2 py-1">Diagnosis</th>
                  {/* <th className="border px-2 py-1">Confidence</th> */}
                </tr>
              </thead>

              <tbody>
                {batchResult.results.map((item: any) => (
                  <tr key={item.row}>
                    <td className="border px-2 py-1">{item.row}</td>

                    <td className="border px-2 py-1">{item.diagnosis}</td>

                    {/* <td className="border px-2 py-1">
                      {toPercent(item.confidence)}
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={() =>
              exportPredictionPdf(uploadedData, batchResult.results)
            }
            className="
              w-full
              bg-green-600
              hover:bg-green-700
              text-white
              py-3
              rounded-lg
              font-semibold
            "
          >
            Download PDF
          </button>
        </>
      )}

      <div className="bg-blue-50 p-2 rounded-lg shadow mt-6">
        <p className="font-bold text-center">Metrik Evaluasi Pelatihan</p>
        <div className="grid grid-cols-4 text-center text-sm font-bold mt-3">
          <div>
            <p className="text-red-500">Accuracy</p>

            <b>{metrics ? toPercent(metrics.accuracy) : "-"}</b>
          </div>

          <div>
            <p className="text-red-500">Precision</p>

            <b>{metrics ? toPercent(metrics.precision) : "-"}</b>
          </div>

          <div>
            <p className="text-red-500">Recall</p>

            <b>{metrics ? toPercent(metrics.recall) : "-"}</b>
          </div>

          <div>
            <p className="text-red-500">F1</p>

            <b>{metrics ? toPercent(metrics.f1_score) : "-"}</b>
          </div>
        </div>
      </div>
    </div>
  );
}
