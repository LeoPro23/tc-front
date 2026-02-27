import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import React from "react";

export async function generateRecipePDF(
  element: HTMLElement,
  filename: string = "reporte-tomatocode.pdf",
): Promise<void> {
  try {
    const canvas = await html2canvas(element, {
      scale: 2, // Para mayor resolución
      useCORS: true,
      backgroundColor: "#0a0a0a",
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfPageHeight = pdf.internal.pageSize.getHeight();

    const imgProps = pdf.getImageProperties(imgData);
    const canvasWidth = imgProps.width;
    const canvasHeight = imgProps.height;

    const ratio = pdfWidth / canvasWidth;
    const imgHeightInPdf = canvasHeight * ratio;

    let heightLeft = imgHeightInPdf;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeightInPdf);
    heightLeft -= pdfPageHeight;

    while (heightLeft >= 0) {
      position = position - pdfPageHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeightInPdf);
      heightLeft -= pdfPageHeight;
    }
    pdf.save(filename);
  } catch (error) {
    console.error("Error al generar PDF:", error);
    throw new Error("No se pudo generar el archivo PDF.");
  }
}
