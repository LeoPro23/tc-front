import jsPDF from "jspdf";
import html2canvas from "html2canvas";
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

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(filename);
  } catch (error) {
    console.error("Error al generar PDF:", error);
    throw new Error("No se pudo generar el archivo PDF.");
  }
}
