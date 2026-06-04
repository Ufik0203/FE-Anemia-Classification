import { useState } from "react";
import FileUpload from "./components/FileUpload";
import ManualInput from "./components/ManualInput";
import ResultPanel from "./components/ResultPanel";
import { usePrediction } from "./hook/usePrediction";

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

        <p className="text-center text-gray-600 mb-8">
          Masukkan parameter CBC atau upload file untuk prediksi anemia
        </p>

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
      </div>
    </div>
  );
}

export default App;
