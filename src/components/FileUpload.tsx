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

type MissingValue = {
  row: number;
  column: string;
};

export default function FileUpload({ onUpload, resetSignal }: any) {
  const [preview, setPreview] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [uploadedData, setUploadedData] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isMissingValue = (value: any) => {
    if (value === null || value === undefined) {
      return true;
    }

    if (typeof value === "string" && value.trim() === "") {
      return true;
    }

    if (typeof value === "number" && Number.isNaN(value)) {
      return true;
    }

    return false;
  };

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

      const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(
        worksheet,
        {
          defval: null,
          raw: true,
        },
      );

      if (!jsonData.length) {
        setError("File kosong");
        return;
      }

      /*
       * Normalisasi nama kolom.
       *
       * Contoh:
       * " WBC " menjadi "WBC"
       */
      const normalizedData = jsonData.map((row) => {
        const normalizedRow: Record<string, any> = {};

        Object.entries(row).forEach(([key, value]) => {
          normalizedRow[key.trim()] = value;
        });

        return normalizedRow;
      });

      /*
       * Validasi nama feature / kolom
       */
      const uploadedColumns = Object.keys(normalizedData[0]);

      const missingColumns = REQUIRED_COLUMNS.filter(
        (col) => !uploadedColumns.includes(col),
      );

      if (missingColumns.length > 0) {
        setError(
          `Kolom tidak ditemukan: ${missingColumns.join(", ")}`,
        );

        return;
      }

      /*
       * Validasi missing value
       */
      const missingValues: MissingValue[] = [];

      normalizedData.forEach((row, rowIndex) => {
        REQUIRED_COLUMNS.forEach((col) => {
          if (isMissingValue(row[col])) {
            missingValues.push({
              /*
               * +2 karena:
               * row 1 = header Excel
               * index array dimulai dari 0
               */
              row: rowIndex + 2,
              column: col,
            });
          }
        });
      });

      if (missingValues.length > 0) {
        const maxDisplayedErrors = 10;

        const missingDetails = missingValues
          .slice(0, maxDisplayedErrors)
          .map(
            (item) =>
              `${item.column} pada baris ${item.row}`,
          )
          .join(", ");

        const remainingMissingValues =
          missingValues.length > maxDisplayedErrors
            ? ` dan ${
                missingValues.length - maxDisplayedErrors
              } missing value lainnya`
            : "";

        setError(
          `Missing value terdeteksi pada ${missingDetails}${remainingMissingValues}. Lengkapi seluruh feature sebelum melakukan prediksi.`,
        );

        return;
      }

      /*
       * Susun feature sesuai urutan model
       */
      const reordered = normalizedData.map((row) => {
        const orderedRow: Record<string, any> = {};

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
          <Upload
            size={36}
            className="text-blue-500 mb-3"
          />

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

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-red-600 font-medium text-sm">
            {error}
          </p>
        </div>
      )}

      {preview.length > 0 && (
        <div className="mt-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-3">
            <h3 className="font-bold">
              Data Berhasil Dimuat
            </h3>

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
                      <th
                        key={col}
                        className="border px-3 py-2 text-left"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {preview.map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-gray-50"
                    >
                      {REQUIRED_COLUMNS.map((col) => (
                        <td
                          key={col}
                          className="border px-3 py-2"
                        >
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