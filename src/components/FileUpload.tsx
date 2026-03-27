export default function FileUpload({ onUpload }: any) {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    onUpload(e.target.files[0]);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <button className="w-full bg-amber-800 text-white py-2 rounded-lg mb-4">
        Unggah File CSV / Excel
      </button>

      <input
        type="file"
        onChange={handleFile}
        className="w-full border p-2 rounded"
      />
    </div>
  );
}
