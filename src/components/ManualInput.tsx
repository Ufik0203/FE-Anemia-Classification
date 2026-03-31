import { Button, Modal } from "@heroui/react";
import { useRef, useState, type JSX } from "react";

const features = [
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

export default function ManualInput({ onSubmit }: any) {
  const [form, setForm] = useState<Record<string, string>>(
    Object.fromEntries(features.map((f) => [f, ""])),
  );
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [isOpen, setIsOpen] = useState(false);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, selectionStart } = e.target;

    if (!/^\d*\.?\d*$/.test(value)) return;

    let newValue = value;
    let cursor = selectionStart ?? value.length;

    const prevValue = form[name];

    if (prevValue === "0.0" && value.length <= 4) {
      newValue = value.replace(/^0\.0/, "");
      cursor = newValue.length;
    }

    if (newValue === "") {
      setForm((prev) => ({ ...prev, [name]: "" }));
      return;
    }

    if (!newValue.includes(".")) {
      newValue = newValue + ".0";
    } else {
      const prevValue = form[name];
      const dotIndex = prevValue.indexOf(".");

      const inputChar = (e.nativeEvent as InputEvent).data;

      if (
        dotIndex !== -1 &&
        selectionStart !== null &&
        (selectionStart === dotIndex + 2 || selectionStart === dotIndex + 3) &&
        prevValue.endsWith(".0") &&
        inputChar !== null 
      ) {
        const int = prevValue.slice(0, dotIndex);

        newValue = int + "." + inputChar;

        cursor = dotIndex + 2;
      }
    }

    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    requestAnimationFrame(() => {
      const input = inputRefs.current[name];
      if (input) {
        input.setSelectionRange(cursor, cursor);
      }
    });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (value === "") {
      setForm((prev) => ({ ...prev, [name]: "" }));
      return;
    }

    const formatted = Number(value).toString();

    setForm((prev) => ({
      ...prev,
      [name]: formatted.includes(".") ? formatted : formatted + ".0",
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.ctrlKey ||
      e.metaKey ||
      ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
    )
      return;

    if (!/[0-9.]/.test(e.key)) e.preventDefault();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData.getData("text");
    if (!/^\d*\.?\d*$/.test(paste)) e.preventDefault();
  };

  const handleReset = () => {
    setForm(Object.fromEntries(features.map((f) => [f, ""])));
    setErrors({});
    setIsOpen(false);
  };

  const submitForm = (data: Record<string, string>) => {
    const numericForm = Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, Number(v)]),
    );
    onSubmit(numericForm);
  };

  const handleSubmit = () => {
    const emptyFields = features.filter((f) => !form[f] || form[f] === "");

    if (emptyFields.length > 0) {
      setIsOpen(true);
      return;
    }

    submitForm(form);
  };

  const handleAccept = () => {
    const emptyFields = features.filter((f) => !form[f] || form[f] === "0.0");

    const filledForm = { ...form };

    emptyFields.forEach((f) => {
      filledForm[f] = Number(defaultValues[f]).toFixed(1);
    });

    setForm(filledForm);
    setErrors({});
    setIsOpen(false);
  };

  const handleReject = () => {
    const emptyFields = features.filter((f) => !form[f] || form[f] === "0.0");

    const newErrors: Record<string, boolean> = {};
    emptyFields.forEach((f) => (newErrors[f] = true));

    setErrors(newErrors);
    setIsOpen(false);
  };

  const getUnit = (feature: string) => {
    const units: Record<string, JSX.Element> = {
      WBC: (
        <>
          10<sup>3</sup>/µL
        </>
      ),
      LYMp: <>%</>,
      NEUTp: <>%</>,
      LYMn: (
        <>
          10<sup>3</sup>/µL
        </>
      ),
      NEUTn: (
        <>
          10<sup>3</sup>/µL
        </>
      ),
      RBC: (
        <>
          10<sup>6</sup>/µL
        </>
      ),
      HGB: <>g/dL</>,
      HCT: <>%</>,
      MCV: <>fL</>,
      MCH: <>pg</>,
      MCHC: <>g/dL</>,
      PLT: (
        <>
          10<sup>3</sup>/µL
        </>
      ),
      PDW: <>fL</>,
      PCT: <>%</>,
    };
    return units[feature] || null;
  };

  const defaultValues: Record<string, number> = {
    WBC: 7,
    LYMp: 30,
    NEUTp: 60,
    LYMn: 2,
    NEUTn: 4,
    RBC: 5,
    HGB: 14,
    HCT: 40,
    MCV: 90,
    MCH: 30,
    MCHC: 33,
    PLT: 250,
    PDW: 12,
    PCT: 0.2,
  };

  const renderInput = (f: string) => (
    <div key={f} className="mb-3">
      <div className="relative">
        <div className="absolute inset-0 grid grid-cols-2 sm:grid-cols-4 items-center px-3 pointer-events-none text-sm text-gray-500">
          <span className="font-medium text-gray-600">{f}</span>
          {form[f] === "" ? (
            <span className="col-span-2 text-end text-xs font-semibold hidden sm:block">
              Contoh: 7.8
            </span>
          ) : (
            <span className="col-span-2 hidden sm:flex"></span>
          )}

          <span className="text-center text-xs font-semibold">
            {getUnit(f)}
          </span>
        </div>

        <input
          ref={(el) => {
            inputRefs.current[f] = el;
          }}
          name={f}
          value={form[f]}
          placeholder="0.0"
          inputMode="decimal"
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          onBlur={handleBlur}
          onPaste={handlePaste}
          onFocus={() => setErrors((prev) => ({ ...prev, [f]: false }))}
          className={`w-full h-10 border p-2 pl-13 lg:pl-15 pr-17 lg:pr-24 rounded text-sm text-green-600
            ${errors[f] ? "border-red-500" : "border-gray-300"}
            focus:outline-green-500`}
          maxLength={10}
        />
      </div>

      {errors[f] && <p className="text-red-500 text-xs mt-1">Wajib diisi</p>}
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <button className="w-full bg-green-500 text-white py-2 rounded-lg mb-4">
        Input Manual
      </button>

      <h3 className="font-semibold mb-2">Leukosit & Diferensial</h3>
      <div className="grid grid-cols-2 gap-x-5">
        {features.slice(0, 5).map(renderInput)}
      </div>

      <h3 className="font-semibold mt-4 mb-2">Eritrosit & Indeks</h3>
      <div className="grid grid-cols-2 gap-x-5">
        {features.slice(5, 11).map(renderInput)}
      </div>

      <h3 className="font-semibold mt-4 mb-2">Trombosit</h3>
      <div className="grid grid-cols-2 gap-x-5">
        {features.slice(11).map(renderInput)}
      </div>

      <div className="flex gap-2 mt-4">
        <Button
          onClick={handleSubmit}
          className="flex-1 bg-blue-500 text-white py-2 rounded-sm"
        >
          Prediksi
        </Button>

        <Button
          onClick={handleReset}
          className="flex-1 bg-red-500 text-white py-2 rounded-sm"
        >
          Reset
        </Button>
      </div>

      {isOpen && (
        <Modal>
          <div className="fixed inset-0 flex items-center justify-center bg-black/30">
            <div className="bg-white p-5 rounded-lg w-full max-w-md">
              <h2 className="text-lg font-semibold mb-2">Konfirmasi</h2>

              <p className="text-sm text-gray-600 mb-4">
                Ada field kosong. Isi dengan nilai default?
              </p>

              <div className="flex justify-end gap-2">
                <Button
                  onClick={handleReject}
                  className="bg-gray-200 text-black"
                >
                  Tidak
                </Button>

                <Button
                  onClick={handleAccept}
                  className="bg-blue-500 text-white"
                >
                  Ya, isi otomatis
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
