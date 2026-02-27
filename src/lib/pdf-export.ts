import jsPDF from "jspdf";
import { domToPng } from "modern-screenshot";

export async function generateRecipePDF(
  element: HTMLElement,
  filename: string = "reporte-tomatocode.pdf",
): Promise<void> {
  try {
    // modern-screenshot es más robusto y maneja mejor las fuentes
    // y los estilos complejos de Tailwind 4 / CSS moderno.
    const imgData = await domToPng(element, {
      scale: 2, // Para alta resolución
      backgroundColor: "#0a0a0a",
      // Opciones adicionales de estabilidad si fueran necesarias
      debug: false,
    });

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(filename);
  } catch (error) {
    console.error("Error al generar PDF:", error);
    throw new Error(
      "No se pudo generar el archivo PDF (Error de procesamiento visual).",
    );
  }
}
