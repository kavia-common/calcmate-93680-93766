import React from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// PUBLIC_INTERFACE
export default function ExportButtons({ exportRef, entry }) {
  // Export to PNG Image
  const handleExportImage = async () => {
    if (!exportRef.current) return;
    const canvas = await html2canvas(exportRef.current, { backgroundColor: "#fff" });
    const link = document.createElement('a');
    link.download = "calcmate-solution.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  // Export to PDF
  const handleExportPDF = async () => {
    if (!exportRef.current) return;
    const canvas = await html2canvas(exportRef.current, { backgroundColor: "#fff", scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pageWidth - 32;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 16, 24, pdfWidth, pdfHeight, '', 'FAST');
    pdf.save("calcmate-solution.pdf");
  };

  return (
    <div style={{marginBottom: "1.3em", marginTop: "-0.5em"}}>
      <b>Export:</b>
      <button className="button secondary" onClick={handleExportImage}>
        as Image
      </button>
      <button className="button secondary" onClick={handleExportPDF}>
        as PDF
      </button>
    </div>
  );
}
