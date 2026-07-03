import { useState } from "react";
import FileUpload from "./components/FileUpload";
import ManualInput from "./components/ManualInput";
import ResultPanel from "./components/ResultPanel";
import { usePrediction } from "./hook/usePrediction";
import { Button } from "@heroui/react";

function App() {
  const {
    result,
    batchResult,
    uploadedData,
    handlePredict,
    handleFile,
    loading,
    resetAll,
  } = usePrediction();
  const [resetSignal, setResetSignal] = useState(0);

  const handleResetAll = () => {
    resetAll();

    setResetSignal((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-blue-500 mb-4">
          Anemia Detection Assistant
        </h1>

        <p className="text-center text-gray-600">
          Masukkan parameter CBC atau upload file untuk prediksi anemia
        </p>
        <div className="flex justify-center">
          <Button className="min-w-100 min-h-10 bg-red-400 flex items-center justify-center my-8 rounded-lg font-bold text-white cursor-pointer">
            <a
              href="https://drive.google.com/file/d/1pJwZEpL0de4qlAqZCPSP9AEfJu29OTSo/view"
              target="_blank"
              rel="noopener noreferrer"
            >
              Template File CBC dapat di Download di Sini.
            </a>
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <ManualInput
            onSubmit={handlePredict}
            onResetAll={handleResetAll}
            resetSignal={resetSignal}
          />

          <div className="space-y-4">
            <FileUpload onUpload={handleFile} resetSignal={resetSignal} />

            <ResultPanel
              result={result}
              batchResult={batchResult}
              uploadedData={uploadedData}
              loading={loading}
              resetSignal={resetSignal}
            />
          </div>
        </div>
        <p className="text-center text-gray-600 mb-8 pt-20 text-xs font-semibold">
          Sistem ini hanya mengklasifikasikan lima jenis anemia: Normocytic
          Normochromic Anemia, Normocytic Hypochromic Anemia, Iron Deficiency
          Anemia, Other Microcytic Anemia, dan Macrocytic Anemia. Sistem tidak
          mendeteksi kondisi sehat (non-anemia). Hasil prediksi harus divalidasi
          oleh tenaga medis yang kompeten.
        </p>
      </div>
    </div>
  );
}

export default App;
