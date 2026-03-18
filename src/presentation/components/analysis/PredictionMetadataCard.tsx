import { Target, Thermometer } from "lucide-react";
import type { Detection, ImageAnalysisEntry } from "./types";

interface PredictionMetadataCardProps {
  modelNames: string[];
  activeFilterLabel: string;
  selectedEntry: ImageAnalysisEntry | null;
  filteredDetections: Detection[];
}

function formatModelName(model: string) {
  const lower = model.toLowerCase();

  if (lower === "yolov8m_v2_last") return "YOLOv8 Nano";

  if (lower.includes("v8n")) return "YOLOv8 Nano";
  if (lower.includes("v8m")) return "YOLOv8 Medium";
  if (lower.includes("yolo26")) return "YOLO26N";

  return model;
}

export function PredictionMetadataCard({
  modelNames,
  activeFilterLabel,
  selectedEntry,
  filteredDetections,
}: PredictionMetadataCardProps) {
  return (
    <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl p-6 rounded-3xl border border-gray-200 dark:border-white/5 flex flex-col justify-between group overflow-hidden relative shadow-sm dark:shadow-none">
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/5 dark:bg-[#00ff9d]/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 dark:group-hover:bg-[#00ff9d]/10 transition-colors"></div>
      <div>
        <div className="flex items-center gap-4 mb-4">
          <div className="p-2.5 bg-gray-100 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10">
            <Target className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="font-black italic text-xs text-gray-600 dark:text-gray-300 uppercase tracking-widest">
              Metadatos de Prediccion
            </h3>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">
              MODELOS: {modelNames.length > 0 ? modelNames.map(formatModelName).join(" | ") : "N/D"}
            </p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">
              FILTRO: {activeFilterLabel}
            </p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">
              VERIFICACION: {selectedEntry?.verified === false ? "RECHAZADA" : "APROBADA"}
            </p>
          </div>
        </div>
        <div className="space-y-3 font-mono">
          <div className="flex justify-between text-[10px]">
            <span className="text-gray-500 dark:text-gray-600 uppercase">Conteo de Detecciones</span>
            <span className="font-bold">{filteredDetections.length} Objetivos</span>
          </div>
          <div className="flex justify-between text-[10px] pt-3 border-t border-gray-100 dark:border-white/5">
            <span className="text-gray-500 dark:text-gray-600 uppercase flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-emerald-500 dark:text-[#00ff9d]" />
              Lectura Bio-Termica
            </span>
            <span className="font-bold">36.9C // ESTABLE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
