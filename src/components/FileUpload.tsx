import { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { Upload, FileSpreadsheet, X } from "lucide-react";

const REQUIRED_COLUMNS = [
  "WBC",
  "LYMp",
  "NEUTp",
  "LYMn",
  "NEUTn",
  "RBC",
  "HGB",
  "HCT",
  "MCV",
  "MCH",
  "MCHC",
  "PLT",
  "PDW",
  "PCT",
];

export default function FileUpload({ onUpload, resetSignal }: any) {
  const [preview, setPreview] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [uploadedData, setUploadedData] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = e.target.files[0];

    e.target.value = "";

    setError("");
    setPreview([]);
    setUploadedData([]);
    setSelectedFile(null);

    try {
      const data = await file.arrayBuffer();

      const workbook = XLSX.read(data);

      const sheetName = workbook.SheetNames[0];

      const worksheet = workbook.Sheets[sheetName];

      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

      if (!jsonData.length) {
        setError("File kosong");
        return;
      }

      const uploadedColumns = Object.keys(jsonData[0]).map((c) => c.trim());

      const missing = REQUIRED_COLUMNS.filter(
        (col) => !uploadedColumns.includes(col),
      );

      if (missing.length > 0) {
        setError(`Kolom tidak ditemukan: ${missing.join(", ")}`);
        return;
      }

      const reordered = jsonData.map((row) => {
        const orderedRow: any = {};

        REQUIRED_COLUMNS.forEach((col) => {
          orderedRow[col] = row[col];
        });

        return orderedRow;
      });

      setPreview(reordered.slice(0, 5));
      setUploadedData(reordered);
      setSelectedFile(file);
    } catch (err) {
      console.error(err);
      setError("Gagal membaca file");
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreview([]);
    setUploadedData([]);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    setPreview([]);
    setUploadedData([]);
    setSelectedFile(null);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [resetSignal]);

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow">
      <button className="w-full bg-amber-800 text-white py-2 rounded-lg mb-4">
        Unggah File CSV / Excel
      </button>

      <input
        ref={fileInputRef}
        id="file-upload"
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleFile}
        className="hidden"
      />

      {!selectedFile && (
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 sm:p-10 cursor-pointer transition hover:border-blue-500 hover:bg-blue-50"
        >
          <Upload size={36} className="text-blue-500 mb-3" />

          <h3 className="font-semibold text-base sm:text-lg text-center">
            Upload File CSV atau Excel
          </h3>

          <p className="text-gray-500 text-sm mt-1 text-center">
            Klik untuk memilih file
          </p>
        </label>
      )}

      {selectedFile && (
        <div className="border rounded-xl p-4 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
            <div className="flex gap-3 min-w-0">
              <FileSpreadsheet
                size={34}
                className="text-green-600 shrink-0"
              />

              <div className="min-w-0">
                <p
                  className="font-semibold truncate max-w-45 sm:max-w-xs"
                  title={selectedFile.name}
                >
                  {selectedFile.name}
                </p>

                <p className="text-sm text-gray-500">
                  {uploadedData.length} data ditemukan
                </p>
              </div>
            </div>

            <button
              onClick={removeFile}
              className="self-end sm:self-start text-gray-400 hover:text-red-500 transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-red-500 mt-4 font-medium">{error}</p>}

      {preview.length > 0 && (
        <div className="mt-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-3">
            <h3 className="font-bold">Data Berhasil Dimuat</h3>

            <span className="text-sm text-gray-500">
              Total Data: {uploadedData.length}
            </span>
          </div>

          <div className="hidden sm:block">
            <div className="overflow-x-auto border rounded-lg">
              <table className="min-w-225 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    {REQUIRED_COLUMNS.map((col) => (
                      <th key={col} className="border px-3 py-2 text-left">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {preview.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      {REQUIRED_COLUMNS.map((col) => (
                        <td key={col} className="border px-3 py-2">
                          {row[col]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <button
            onClick={() => onUpload(uploadedData)}
            className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition cursor-pointer text-sm sm:text-base"
          >
            Prediksi {uploadedData.length} Data
          </button>
        </div>
      )}
    </div>
  );
}
