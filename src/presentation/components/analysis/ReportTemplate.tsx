import React from "react";
import {
  Leaf,
  ShieldCheck,
  Zap,
  TrendingUp,
  Cpu,
  User as UserIcon,
  Calendar,
  AlertTriangle,
  Bug,
  Thermometer,
  Sprout,
  CloudSun,
  FileText,
  MapPin,
} from "lucide-react";
import { ReportData } from "./types";

interface ReportTemplateProps {
  data: ReportData;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const ReportTemplate: React.FC<ReportTemplateProps> = ({
  data,
  containerRef,
}) => {
  const {
    user,
    detection,
    recipe,
    date,
    imageEntries,
    batchInterpretation,
    agronomicContext,
    isInfected,
    bugDensity,
    fieldName,
  } = data;

  const confidencePercent = detection
    ? detection.confidence <= 1
      ? detection.confidence * 100
      : detection.confidence
    : 0;

  const modelsPresent = Array.from(
    new Set((imageEntries || []).flatMap((e) => e.models)),
  );

  const formatModelName = (model: string) => {
    const lower = model.toLowerCase();

    if (lower === "yolov8m_v2_last") return "YOLOv8 Nano";

    if (lower.includes("v8n")) return "YOLOv8 Nano";
    if (lower.includes("v8m")) return "YOLOv8 Medium";
    if (lower.includes("yolo26")) return "YOLO26N";

    return model;
  };

  const infectedImages = imageEntries.filter(
    (e) => e.verified && e.detections.length > 0,
  ).length;
  const cleanImages = imageEntries.filter(
    (e) => e.verified && e.detections.length === 0,
  ).length;
  const rejectedImages = imageEntries.filter((e) => !e.verified).length;

  return (
    <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
      <div
        ref={containerRef}
        className="w-[800px] bg-[#0a0a0a] text-white p-12 font-sans relative overflow-hidden"
      >
        {/* Background Decorations */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00ff9d05_1px,transparent_1px),linear-gradient(to_bottom,#00ff9d05_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00ff9d]/5 blur-[100px] rounded-full" />

        {/* Header */}
        <div className="relative flex justify-between items-start mb-12 border-b border-white/10 pb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[#FF6347] to-[#32CD32] rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(0,255,157,0.2)]">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter uppercase mr-2">
                PLAGA<span className="text-[#00ff9d]">CODE</span>
              </h1>
              <p className="text-[10px] font-mono text-[#00ff9d]/60 tracking-[0.4em] uppercase">
                Reporte Integral de Análisis Fitosanitario
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">
              ID DE REPORTE
            </p>
            <p className="text-sm font-mono text-white/80">
              #{Math.random().toString(36).slice(2, 11).toUpperCase()}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative flex flex-col gap-8">
          {/* Status Bar */}
          <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-[#00ff9d]" />
              <span className="text-[11px] font-mono text-gray-400 uppercase tracking-widest">
                Fecha
              </span>
              <span className="text-xs font-bold ml-2">{date}</span>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`text-[10px] px-3 py-1 rounded border font-black ${
                  isInfected
                    ? "bg-[#ff003c]/20 text-[#ff003c] border-[#ff003c]/30"
                    : "bg-[#00ff9d]/20 text-[#00ff9d] border-[#00ff9d]/30"
                }`}
              >
                {isInfected ? "INFECCIÓN DETECTADA" : "CULTIVO SALUDABLE"}
              </span>
            </div>
          </div>

          {/* Info Grid: Operator + Field + Detection */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <UserIcon className="w-3.5 h-3.5 text-[#00ff9d]" />
                <h3 className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                  Operador
                </h3>
              </div>
              <p className="text-base font-bold text-white">
                {user?.name || "Desconocido"}
              </p>
              <p className="text-[10px] text-gray-500 font-mono">
                {user?.email || "n/a"}
              </p>
            </div>

            <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-3.5 h-3.5 text-[#00ff9d]" />
                <h3 className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                  Lote / Campo
                </h3>
              </div>
              <p className="text-base font-bold text-white">
                {fieldName || "No especificado"}
              </p>
              <p className="text-[10px] text-gray-500 font-mono">
                {imageEntries.length} imagen(es) analizadas
              </p>
            </div>

            <div className="bg-white/5 p-5 rounded-2xl border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-5">
                <Cpu className="w-10 h-10 text-[#ff003c]" />
              </div>
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-3.5 h-3.5 text-[#ff003c]" />
                <h3 className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                  Patógeno Principal
                </h3>
              </div>
              <p className="text-lg font-black text-[#ff003c] italic uppercase">
                {detection?.pest || "Ninguno"}
              </p>
              <span className="text-[10px] font-mono text-white/40">
                {confidencePercent.toFixed(1)}% Confianza
              </span>
            </div>
          </div>

          {/* KPI Metrics */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center">
              <Bug className="w-5 h-5 text-[#ff003c] mx-auto mb-2" />
              <p className="text-2xl font-black text-white">{bugDensity}</p>
              <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">
                Detecciones Totales
              </p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center">
              <AlertTriangle className="w-5 h-5 text-orange-400 mx-auto mb-2" />
              <p className="text-2xl font-black text-white">{infectedImages}</p>
              <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">
                Imágenes Infectadas
              </p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center">
              <ShieldCheck className="w-5 h-5 text-[#00ff9d] mx-auto mb-2" />
              <p className="text-2xl font-black text-white">{cleanImages}</p>
              <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">
                Imágenes Limpias
              </p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center">
              <Cpu className="w-5 h-5 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-black text-white">
                {modelsPresent.length}
              </p>
              <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">
                Modelos IA Usados
              </p>
            </div>
          </div>

          {/* Agronomic Context */}
          {agronomicContext &&
            (agronomicContext.phenologicalState ||
              agronomicContext.soilQuality ||
              agronomicContext.currentClimate) && (
              <div className="space-y-4">
                <h2 className="text-[11px] font-mono text-[#00ff9d] uppercase tracking-[0.4em] flex items-center gap-3">
                  <Sprout className="w-4 h-4" />
                  Contexto Agronómico del Lote
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  {agronomicContext.phenologicalState && (
                    <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Sprout className="w-3.5 h-3.5 text-emerald-400" />
                        <p className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest">
                          Estado Fenológico
                        </p>
                      </div>
                      <p className="text-sm font-bold text-white">
                        {agronomicContext.phenologicalState}
                      </p>
                    </div>
                  )}
                  {agronomicContext.soilQuality && (
                    <div className="bg-amber-500/5 p-4 rounded-xl border border-amber-500/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                        <p className="text-[9px] font-mono text-amber-400 uppercase tracking-widest">
                          Calidad del Suelo
                        </p>
                      </div>
                      <p className="text-sm font-bold text-white">
                        {agronomicContext.soilQuality}
                      </p>
                    </div>
                  )}
                  {agronomicContext.currentClimate && (
                    <div className="bg-sky-500/5 p-4 rounded-xl border border-sky-500/10">
                      <div className="flex items-center gap-2 mb-2">
                        <CloudSun className="w-3.5 h-3.5 text-sky-400" />
                        <p className="text-[9px] font-mono text-sky-400 uppercase tracking-widest">
                          Clima Actual
                        </p>
                      </div>
                      <p className="text-sm font-bold text-white">
                        {agronomicContext.currentClimate}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

          {/* General Summary (Batch Interpretation) */}
          {batchInterpretation && (
            <div className="space-y-4">
              <h2 className="text-[11px] font-mono text-[#00ff9d] uppercase tracking-[0.4em] flex items-center gap-3">
                <FileText className="w-4 h-4" />
                Diagnóstico General del Lote
              </h2>
              <div className="bg-[#00ff9d]/5 p-6 rounded-2xl border border-[#00ff9d]/15">
                <p className="text-sm text-gray-200 leading-relaxed">
                  {batchInterpretation.generalSummary}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
                  <p className="text-[9px] font-mono text-[#00ff9d] uppercase tracking-widest mb-3 font-bold">
                    Recomendación General
                  </p>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {batchInterpretation.generalRecommendation}
                  </p>
                </div>
                <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
                  <p className="text-[9px] font-mono text-orange-400 uppercase tracking-widest mb-3 font-bold">
                    Guía Operativa Global
                  </p>
                  <p className="text-xs text-gray-300 leading-relaxed italic">
                    {batchInterpretation.generalOperativeGuide}
                  </p>
                </div>
              </div>

              {/* Biosecurity Protocol */}
              <div className="bg-[#ff003c]/5 p-5 rounded-2xl border border-[#ff003c]/15 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <AlertTriangle className="w-16 h-16 text-[#ff003c]" />
                </div>
                <p className="text-[9px] font-mono text-[#ff003c] uppercase tracking-widest mb-3 font-bold flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3" />
                  Protocolo de Bioseguridad del Lote
                </p>
                <p className="text-xs text-gray-300 leading-relaxed italic relative z-10">
                  {batchInterpretation.generalBiosecurityProtocol}
                </p>
              </div>
            </div>
          )}

          {/* Agronomic Prescription */}
          <div className="space-y-4">
            <h2 className="text-[11px] font-mono text-[#00ff9d] uppercase tracking-[0.4em] flex items-center gap-3">
              <Zap className="w-4 h-4" />
              Prescripción Agronómica Principal
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-3">
                  Producto Recomendado
                </p>
                <p className="text-lg font-bold italic text-white leading-tight">
                  {batchInterpretation?.generalProduct ||
                    recipe?.product ||
                    "No definido"}
                </p>
              </div>
              <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-3">
                  Dosis de Aplicación
                </p>
                <p className="text-lg font-bold italic text-white leading-tight">
                  {recipe?.dose || "No definido"}
                </p>
              </div>
            </div>

            <div className="bg-[#00ff9d]/5 p-6 rounded-2xl border border-[#00ff9d]/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <ShieldCheck className="w-16 h-16 text-[#00ff9d]" />
              </div>
              <h4 className="text-[10px] font-mono text-[#00ff9d] uppercase tracking-[0.3em] font-black mb-3 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                Guía Operativa Detallada
              </h4>
              <p className="text-sm text-gray-300 leading-relaxed italic font-medium relative z-10">
                {recipe?.method || "No definido"}
              </p>
            </div>
          </div>

          {/* Per-Image Interpretation Details */}
          {imageEntries.some((e) => e.targetPest || e.biosecurityStatus) && (
            <div className="space-y-4 pt-4 border-t border-white/10">
              <h2 className="text-[11px] font-mono text-[#00ff9d] uppercase tracking-[0.4em] flex items-center gap-3">
                <TrendingUp className="w-4 h-4" />
                Diagnóstico por Imagen
              </h2>

              <div className="space-y-3">
                {imageEntries.map((entry, idx) => {
                  if (!entry.verified) return null;
                  const statusColor =
                    entry.biosecurityStatus === "ALTA PRIORIDAD"
                      ? "text-[#ff003c]"
                      : entry.biosecurityStatus === "LIMPIO"
                        ? "text-[#00ff9d]"
                        : "text-orange-400";
                  const statusBg =
                    entry.biosecurityStatus === "ALTA PRIORIDAD"
                      ? "bg-[#ff003c]/10 border-[#ff003c]/20"
                      : entry.biosecurityStatus === "LIMPIO"
                        ? "bg-[#00ff9d]/10 border-[#00ff9d]/20"
                        : "bg-orange-400/10 border-orange-400/20";

                  return (
                    <div
                      key={entry.id}
                      className={`p-4 rounded-xl border ${statusBg}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono text-gray-400 uppercase">
                          Imagen {idx + 1}: {entry.file.name}
                        </span>
                        <span
                          className={`text-[9px] font-black uppercase ${statusColor}`}
                        >
                          {entry.biosecurityStatus || "PROCESADA"}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <p className="text-[9px] font-mono text-gray-500 uppercase mb-1">
                            Plaga Detectada
                          </p>
                          <p className="text-xs font-bold text-white">
                            {entry.targetPest || "Ninguna"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] font-mono text-gray-500 uppercase mb-1">
                            Producto
                          </p>
                          <p className="text-xs text-gray-300">
                            {entry.recipe?.product || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] font-mono text-gray-500 uppercase mb-1">
                            Protocolo
                          </p>
                          <p className="text-xs text-gray-300 italic">
                            {entry.biosecurityProtocol || "Estándar"}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Grouped Images by Model */}
          {modelsPresent.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-white/10">
              <h2 className="text-[11px] font-mono text-[#00ff9d] uppercase tracking-[0.4em] flex items-center gap-3">
                <Cpu className="w-4 h-4" />
                Evidencia Fotográfica Clasificada
              </h2>

              <div className="space-y-8 mt-4">
                {modelsPresent.map((modelName) => {
                  const modelEntries = imageEntries.filter((e) =>
                    e.models.includes(modelName),
                  );
                  if (modelEntries.length === 0) return null;

                  return (
                    <div
                      key={modelName}
                      className="bg-white/5 p-5 rounded-2xl border border-white/5"
                    >
                      <h3 className="text-sm font-bold text-[#00ff9d] uppercase tracking-widest mb-4 border-b border-white/10 pb-3 flex items-center justify-between">
                        <span>MODELO: {formatModelName(modelName)}</span>
                        <span className="text-[10px] text-white/50">
                          {modelEntries.length} IMAGEN(ES)
                        </span>
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {modelEntries.map((entry, idx) => (
                          <div key={entry.id} className="flex flex-col gap-2">
                            <p className="text-[10px] font-mono text-gray-400 uppercase flex justify-between bg-black/40 px-3 py-1.5 rounded-md">
                              <span>Imagen {idx + 1}</span>
                              <span className="truncate max-w-[120px]">
                                {entry.file.name}
                              </span>
                            </p>
                            <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-black/80 flex items-center justify-center">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={entry.previewUrl}
                                alt={entry.file.name}
                                className="max-w-full max-h-full object-contain"
                                crossOrigin="anonymous"
                              />
                              {entry.detections.filter(
                                (d) => d.model === modelName,
                              ).length > 0 && (
                                <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                                  {entry.detections
                                    .filter((d) => d.model === modelName)
                                    .map((det, dIdx) => (
                                      <span
                                        key={dIdx}
                                        className="text-[8px] bg-[#ff003c]/90 text-white font-mono px-2 py-0.5 rounded shadow-lg backdrop-blur-md border border-white/20"
                                      >
                                        {det.pest} ({det.confidence}%)
                                      </span>
                                    ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="relative mt-16 pt-6 border-t border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00ff9d] animate-pulse shadow-[0_0_10px_#00ff9d]" />
            <span className="text-[9px] font-mono text-gray-500 tracking-widest uppercase">
              Verified by PlagaCode Core v4.3.0-LTS
            </span>
          </div>
          <div className="flex gap-4">
            <span className="text-[9px] font-mono text-gray-700 tracking-widest italic font-bold">
              AGRICULTURA DE PRECISIÓN AI
            </span>
          </div>
        </div>

        {/* Visual accents */}
        <div className="absolute top-0 left-0 w-32 h-32 border-t border-l border-[#00ff9d]/20" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-b border-r border-[#00ff9d]/20" />
      </div>
    </div>
  );
};
