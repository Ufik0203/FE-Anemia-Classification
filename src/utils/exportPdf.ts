import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportPredictionPdf = (
  uploadedData: any[],
  predictions: any[],
) => {
  const doc = new jsPDF("landscape");

  doc.setFontSize(18);

  doc.text("Laporan Hasil Klasifikasi Anemia", 14, 15);

  const diagnosisCount = predictions.reduce(
    (acc: Record<string, number>, curr: any) => {
      acc[curr.diagnosis] = (acc[curr.diagnosis] || 0) + 1;

      return acc;
    },
    {},
  );

  let y = 30;

  doc.setFontSize(11);

  const formattedDate = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  doc.text(`Tanggal: ${formattedDate}`, 14, y);

  y += 8;

  doc.text(`Total Sampel: ${uploadedData.length}`, 14, y);

  y += 10;

  doc.text("Ringkasan Diagnosis:", 14, y);

  y += 8;

  Object.entries(diagnosisCount).forEach(([key, value]) => {
    doc.text(`${key}: ${value}`, 20, y);

    y += 6;
  });

  autoTable(doc, {
    startY: y + 5,

    head: [
      [
        "No",
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
        "Diagnosis",
      ],
    ],

    body: uploadedData.map((row, index) => [
      index + 1,
      row.WBC,
      row.LYMp,
      row.NEUTp,
      row.LYMn,
      row.NEUTn,
      row.RBC,
      row.HGB,
      row.HCT,
      row.MCV,
      row.MCH,
      row.MCHC,
      row.PLT,
      row.PDW,
      row.PCT,
      predictions[index]?.diagnosis ?? "-",
    ]),
  });

  doc.save("anemia-detection-report.pdf");
};
