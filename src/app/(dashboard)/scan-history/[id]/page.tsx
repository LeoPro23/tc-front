"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { managementApi } from "@/lib/api/management.service";
import type {
  AnalysisFieldCampaignHistory,
  ModelResult,
} from "@/lib/api/management.types";
import { AnalysisHeader, BiosecurityCard } from "@/presentation/components/analysis";
import { ArrowLeft, ZoomIn, Crosshair, BarChart3, Bug, MapPin, Calendar, Leaf } from "lucide-react";
import { ImageWithFallback } from "@/presentation/components/figma/ImageWithFallback";
import { AudioRecorder } from "@/presentation/components/analysis/AudioRecorder";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import NextImage from "next/image";

type ImageNaturalSize = { w: number; h: number };
type ImageRect = { left: number; top: number; width: number; height: number };

function formatModelDisplayName(name: string): string {
  const lower = name.toLowerCase();
  if (lower === "yolov8m_v2_last") return "YOLOv8 Nano";
  if (lower.includes("v8n")) return "YOLOv8 Nano";
  if (lower.includes("v8m")) return "YOLOv8 Medium";
  if (lower.includes("yolo26")) return "YOLO26N";
  return name;
}

function formatPestDisplayName(name: string): string {
  return name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function computeIoU(boxA: number[], boxB: number[]): number {
  const [ax1, ay1, ax2, ay2] = boxA;
  const [bx1, by1, bx2, by2] = boxB;
  const ix1 = Math.max(ax1, bx1);
  const iy1 = Math.max(ay1, by1);
  const ix2 = Math.min(ax2, bx2);
  const iy2 = Math.min(ay2, by2);
  const intersection = Math.max(0, ix2 - ix1) * Math.max(0, iy2 - iy1);
  const areaA = (ax2 - ax1) * (ay2 - ay1);
  const areaB = (bx2 - bx1) * (by2 - by1);
  const union = areaA + areaB - intersection;
  return union > 0 ? intersection / union : 0;
}

function deduplicateDetections(results: ModelResult[], iouThreshold = 0.3): ModelResult[] {
  if (results.length === 0) return [];
  const sorted = [...results].sort((a, b) => b.confidence - a.confidence);
  const kept: ModelResult[] = [];
  const suppressed = new Set<number>();

  for (let i = 0; i < sorted.length; i++) {
    if (suppressed.has(i)) continue;
    kept.push(sorted[i]);
    for (let j = i + 1; j < sorted.length; j++) {
      if (suppressed.has(j)) continue;
      if (sorted[i].diagnosis !== sorted[j].diagnosis) continue;
      if (sorted[i].boundingBox?.length === 4 && sorted[j].boundingBox?.length === 4) {
        if (computeIoU(sorted[i].boundingBox, sorted[j].boundingBox) >= iouThreshold) {
          suppressed.add(j);
        }
      }
    }
  }
  return kept;
}

interface HistoryImageCanvasProps {
  image: NonNullable<AnalysisFieldCampaignHistory["attachedImages"]>[0];
  visibleResults: ModelResult[];
  highlightedResultId: string | null;
}

function HistoryImageCanvas({
  image,
  visibleResults,
  highlightedResultId,
}: HistoryImageCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [imgNaturalSize, setImgNaturalSize] = useState<ImageNaturalSize | null>(null);
  const [imgRect, setImgRect] = useState<ImageRect | null>(null);

  const computeImgRect = useCallback(() => {
    const container = containerRef.current;
    if (!container || !imgNaturalSize) return;
    const cw = container.clientWidth;
    const ch = container.clientHeight;
    const { w: nw, h: nh } = imgNaturalSize;
    const scale = Math.min(cw / nw, ch / nh);
    const rw = nw * scale;
    const rh = nh * scale;
    setImgRect({ left: (cw - rw) / 2, top: (ch - rh) / 2, width: rw, height: rh });
  }, [imgNaturalSize]);

  useEffect(() => {
    if (!image.url) { setImgNaturalSize(null); setImgRect(null); return; }
    const img = new window.Image();
    img.onload = () => setImgNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = image.url;
  }, [image.url]);

  useEffect(() => {
    computeImgRect();
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(() => computeImgRect());
    ro.observe(container);
    return () => ro.disconnect();
  }, [computeImgRect]);

  return (
    <div ref={containerRef} className="relative w-full h-full bg-gray-100 dark:bg-black/60 rounded-xl overflow-hidden flex items-center justify-center">
      <NextImage src={image.url} alt="Evidencia seleccionada" fill className="object-contain" unoptimized />
      {visibleResults.map((result, i) => {
        if (!result.boundingBox || result.boundingBox.length !== 4) return null;
        const isHighlighted = highlightedResultId === result.id;
        return (
          <motion.div
            key={result.id || i}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: 1,
              scale: 1,
              borderColor: isHighlighted ? "#00ff9d" : "#ff003c",
              boxShadow: isHighlighted
                ? "0 0 40px rgba(0,255,157,0.6)"
                : "0 0 30px rgba(255,0,60,0.4)",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute border-2 rounded-lg z-30 pointer-events-none"
            style={
              imgRect && imgNaturalSize
                ? {
                    left: `${imgRect.left + (result.boundingBox[0] / imgNaturalSize.w) * imgRect.width}px`,
                    top: `${imgRect.top + (result.boundingBox[1] / imgNaturalSize.h) * imgRect.height}px`,
                    width: `${((result.boundingBox[2] - result.boundingBox[0]) / imgNaturalSize.w) * imgRect.width}px`,
                    height: `${((result.boundingBox[3] - result.boundingBox[1]) / imgNaturalSize.h) * imgRect.height}px`,
                  }
                : { display: "none" }
            }
          >
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white -translate-x-1 -translate-y-1" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white translate-x-1 -translate-y-1" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white -translate-x-1 translate-y-1" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white translate-x-1 translate-y-1" />
            <div className="absolute top-0 left-0 -translate-y-full mb-1">
              <div
                className={`text-white text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-sm whitespace-nowrap shadow-lg ${
                  isHighlighted ? "bg-[#00ff9d]/90 text-black" : "bg-[#ff003c]/90"
                }`}
              >
                {result.diagnosis}{" "}
                <span className="opacity-75">{(result.confidence * 100).toFixed(1)}%</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

interface DetectionZoomPreviewProps {
  imageUrl: string;
  boundingBox: number[];
}

function DetectionZoomPreview({ imageUrl, boundingBox }: DetectionZoomPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!boundingBox || boundingBox.length !== 4) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const [x1, y1, x2, y2] = boundingBox;
      const pad = Math.max((x2 - x1), (y2 - y1)) * 0.3;
      const sx = Math.max(0, x1 - pad);
      const sy = Math.max(0, y1 - pad);
      const sw = Math.min(img.width - sx, (x2 - x1) + pad * 2);
      const sh = Math.min(img.height - sy, (y2 - y1) + pad * 2);

      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, 300, 300);

      const scale = Math.min(300 / sw, 300 / sh);
      const dw = sw * scale;
      const dh = sh * scale;
      const dx = (300 - dw) / 2;
      const dy = (300 - dh) / 2;
      ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);

      const bx1 = dx + (x1 - sx) * scale;
      const by1 = dy + (y1 - sy) * scale;
      const bw = (x2 - x1) * scale;
      const bh = (y2 - y1) * scale;
      ctx.strokeStyle = "#00ff9d";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(bx1, by1, bw, bh);
    };
    img.src = imageUrl;
  }, [imageUrl, boundingBox]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full aspect-square rounded-xl border border-[#00ff9d]/30 bg-black/60"
    />
  );
}

interface ModelSummary {
  modelName: string;
  displayName: string;
  totalDetections: number;
  pestBreakdown: Record<string, number>;
  avgConfidence: number;
}

function buildModelSummaries(results: ModelResult[]): ModelSummary[] {
  const map = new Map<string, { pests: Record<string, number>; confs: number[] }>();

  for (const r of results) {
    const name = r.model?.name || "Desconocido";
    if (!map.has(name)) map.set(name, { pests: {}, confs: [] });
    const entry = map.get(name)!;
    entry.pests[r.diagnosis] = (entry.pests[r.diagnosis] || 0) + 1;
    entry.confs.push(r.confidence);
  }

  return Array.from(map.entries()).map(([modelName, { pests, confs }]) => ({
    modelName,
    displayName: formatModelDisplayName(modelName),
    totalDetections: confs.length,
    pestBreakdown: pests,
    avgConfidence: confs.reduce((a, b) => a + b, 0) / confs.length,
  }));
}

const selectClasses =
  "w-full text-xs rounded-lg px-3 py-2 outline-none transition-all cursor-pointer " +
  "bg-gray-100 dark:bg-[#1a1a1a] " +
  "border border-gray-300 dark:border-white/15 " +
  "text-gray-900 dark:text-gray-100 " +
  "focus:ring-2 focus:ring-emerald-500 dark:focus:ring-[#00ff9d]/50 focus:border-emerald-500 dark:focus:border-[#00ff9d]/50";

export default function ScanHistoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [data, setData] = useState<AnalysisFieldCampaignHistory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  const [selectedModel, setSelectedModel] = useState<string>("All");
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<string>("All");
  const [selectedDetectionId, setSelectedDetectionId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedModel("All");
    setSelectedDiagnosis("All");
    setSelectedDetectionId(null);
  }, [activeTab]);

  useEffect(() => {
    setSelectedDetectionId(null);
  }, [selectedModel, selectedDiagnosis]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        if (!id) return;
        const result = await managementApi.getScanDetails(id);
        if (active) setData(result);
      } catch (err) {
        console.error("Error loading scan details", err);
      } finally {
        if (active) setIsLoading(false);
      }
    })();
    return () => { active = false; };
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">No se encontró el análisis</h2>
        <button onClick={() => router.back()} className="text-emerald-600 hover:text-emerald-700 font-bold underline">
          Volver
        </button>
      </div>
    );
  }

  const {
    date,
    isInfected,
    primaryTargetPest,
    generalSummary,
    generalRecommendation,
    recommendedProduct,
    biosecurityProtocol: generalBiosecurityProtocol,
    fieldCampaign,
    attachedImages,
    phenologicalState,
    soilQuality,
    currentClimate,
  } = data;

  const mainPest = primaryTargetPest || (isInfected ? "PLAGA DESCONOCIDA" : "SALUDABLE");
  const selectedImage = attachedImages && attachedImages.length > 0 ? attachedImages[activeTab] : null;

  const allResults = selectedImage?.modelResults ?? [];

  const availableModels = Array.from(new Set(allResults.map((r) => r.model?.name || "Desconocido")));

  const filteredByModel = selectedModel === "All"
    ? deduplicateDetections(allResults)
    : allResults.filter((r) => (r.model?.name || "Desconocido") === selectedModel);

  const availableDiagnoses = Array.from(new Set(filteredByModel.map((r) => r.diagnosis)));

  const filteredResults = selectedDiagnosis === "All"
    ? filteredByModel
    : filteredByModel.filter((r) => r.diagnosis === selectedDiagnosis);

  const selectedDetection = selectedDetectionId
    ? filteredResults.find((r) => r.id === selectedDetectionId) ?? null
    : null;

  const modelSummaries = buildModelSummaries(allResults);

  const deduplicatedAll = deduplicateDetections(allResults);
  const allDetectionPests = Array.from(new Set(deduplicatedAll.map((r) => r.diagnosis)));
  const globalAvgConfidence = deduplicatedAll.length > 0
    ? deduplicatedAll.reduce((sum, r) => sum + r.confidence, 0) / deduplicatedAll.length
    : 0;

  const fieldName = fieldCampaign?.field?.name ?? "Desconocido";

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">
      <Link href="/scan-history" className="inline-flex items-center text-emerald-600 dark:text-[#00ff9d] hover:underline mb-4 font-bold text-sm">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Volver al historial
      </Link>

      <AnalysisHeader />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col gap-6">

          {/* Lot Information Card */}
          <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-none">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-50 dark:bg-[#00ff9d]/10 rounded-xl">
                <MapPin className="w-5 h-5 text-emerald-600 dark:text-[#00ff9d]" />
              </div>
              <div>
                <h2 className="text-lg font-black tracking-tighter italic text-gray-900 dark:text-white uppercase">
                  {fieldName}
                </h2>
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Lote Analizado</p>
              </div>
              <div className={`ml-auto px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                isInfected
                  ? "bg-[#ff003c]/15 text-[#ff003c] border border-[#ff003c]/30"
                  : "bg-emerald-50 dark:bg-[#00ff9d]/15 text-emerald-600 dark:text-[#00ff9d] border border-emerald-300 dark:border-[#00ff9d]/30"
              }`}>
                {isInfected ? "INFECCIÓN DETECTADA" : "SALUDABLE"}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Calendar className="w-3 h-3 text-gray-400" />
                  <p className="text-[9px] font-mono text-gray-500 uppercase">Fecha de Escaneo</p>
                </div>
                <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                  {new Date(date).toLocaleDateString("es-ES", { year: "numeric", month: "short", day: "numeric" })}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Bug className="w-3 h-3 text-gray-400" />
                  <p className="text-[9px] font-mono text-gray-500 uppercase">Plaga Principal</p>
                </div>
                <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{formatPestDisplayName(mainPest)}</p>
              </div>
              <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Crosshair className="w-3 h-3 text-gray-400" />
                  <p className="text-[9px] font-mono text-gray-500 uppercase">Detecciones Totales</p>
                </div>
                <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{deduplicatedAll.length}</p>
              </div>
              <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <BarChart3 className="w-3 h-3 text-gray-400" />
                  <p className="text-[9px] font-mono text-gray-500 uppercase">Precisión Promedio</p>
                </div>
                <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                  {globalAvgConfidence > 0 ? `${(globalAvgConfidence * 100).toFixed(1)}%` : "N/A"}
                </p>
              </div>
            </div>

            {(phenologicalState || soilQuality || currentClimate) && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10 grid grid-cols-3 gap-3">
                {phenologicalState && (
                  <div className="flex items-center gap-2">
                    <Leaf className="w-3 h-3 text-emerald-500" />
                    <span className="text-[10px] text-gray-500">{phenologicalState}</span>
                  </div>
                )}
                {soilQuality && (
                  <span className="text-[10px] text-gray-500">Suelo: {soilQuality}</span>
                )}
                {currentClimate && (
                  <span className="text-[10px] text-gray-500">Clima: {currentClimate}</span>
                )}
              </div>
            )}
          </div>

          {/* General Summary */}
          <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-none">
            <h2 className="text-sm font-black tracking-tighter italic text-emerald-600 dark:text-[#00ff9d] uppercase mb-3">
              Resumen del Lote
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {generalSummary || "Sin resumen disponible."}
            </p>
            <h3 className="text-xs font-black tracking-tighter italic text-gray-900 dark:text-white uppercase mb-2">Recomendación General</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              {generalRecommendation || "Sin recomendación."}
            </p>
            {recommendedProduct && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-white/10">
                <p className="text-[10px] font-mono text-gray-500 uppercase mb-1">Producto Recomendado</p>
                <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{recommendedProduct}</p>
              </div>
            )}
          </div>

          {/* Model Summary Cards */}
          {modelSummaries.length > 0 && (
            <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-none">
              <h3 className="text-sm font-black tracking-tighter italic text-gray-900 dark:text-white uppercase mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-500" />
                Resumen por Modelo
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {modelSummaries.map((summary) => (
                  <div
                    key={summary.modelName}
                    className="bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-[#00ff9d]">
                        {summary.displayName}
                      </p>
                      <span className="text-[10px] font-mono bg-emerald-50 dark:bg-[#00ff9d]/10 text-emerald-700 dark:text-[#00ff9d] px-2 py-0.5 rounded-md">
                        {(summary.avgConfidence * 100).toFixed(1)}% avg
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-gray-500 uppercase mb-2">
                      {summary.totalDetections} detección(es) total(es)
                    </p>
                    <div className="space-y-1.5">
                      {Object.entries(summary.pestBreakdown).map(([pest, count]) => (
                        <div key={pest} className="flex items-center justify-between">
                          <span className="text-[11px] text-gray-700 dark:text-gray-300">
                            {formatPestDisplayName(pest)}
                          </span>
                          <span className="text-[11px] font-bold text-gray-900 dark:text-white bg-gray-200 dark:bg-white/10 px-2 py-0.5 rounded">
                            {count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {allDetectionPests.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
                  <p className="text-[10px] font-mono text-gray-500 uppercase mb-2">Resumen Global (deduplicado — mejores detecciones)</p>
                  <div className="flex flex-wrap gap-2">
                    {allDetectionPests.map((pest) => {
                      const pestResults = deduplicatedAll.filter((r) => r.diagnosis === pest);
                      const count = pestResults.length;
                      const avg = pestResults.reduce((s, r) => s + r.confidence, 0) / count;
                      return (
                        <div key={pest} className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-center">
                          <p className="text-[11px] font-bold text-gray-800 dark:text-gray-200">{formatPestDisplayName(pest)}</p>
                          <p className="text-[10px] text-gray-500">{count} detección(es) · {(avg * 100).toFixed(1)}% avg</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Evidence Viewer */}
          {attachedImages && attachedImages.length > 0 && (
            <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-none">
              <h3 className="text-sm font-black tracking-tighter italic text-gray-900 dark:text-white uppercase mb-4">
                Evidencias Capturadas ({attachedImages.length})
              </h3>

              <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2 mb-4">
                {attachedImages.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveTab(idx)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      activeTab === idx
                        ? "border-emerald-500 dark:border-[#00ff9d]"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <ImageWithFallback src={img.url} alt={`Evidencia ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {selectedImage && (
                  <motion.div
                    key={selectedImage.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    {/* Selectors Row */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-gray-50 dark:bg-black/20 rounded-xl p-4">
                      <div className="flex flex-col">
                        <label className="text-[10px] font-mono font-bold uppercase text-gray-500 dark:text-gray-400 mb-1.5">
                          Modelo
                        </label>
                        <select
                          value={selectedModel}
                          onChange={(e) => { setSelectedModel(e.target.value); setSelectedDiagnosis("All"); }}
                          className={selectClasses}
                        >
                          <option value="All">Todos los modelos</option>
                          {availableModels.map((m) => (
                            <option key={m} value={m}>{formatModelDisplayName(m)}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-col">
                        <label className="text-[10px] font-mono font-bold uppercase text-gray-500 dark:text-gray-400 mb-1.5">
                          Plaga Detectada
                        </label>
                        <select
                          value={selectedDiagnosis}
                          onChange={(e) => setSelectedDiagnosis(e.target.value)}
                          className={selectClasses}
                        >
                          <option value="All">Todas las plagas</option>
                          {availableDiagnoses.map((d) => (
                            <option key={d} value={d}>{formatPestDisplayName(d)} ({filteredByModel.filter((r) => r.diagnosis === d).length})</option>
                          ))}
                        </select>
                      </div>

                      {selectedDiagnosis !== "All" && filteredResults.length > 0 && (
                        <div className="flex flex-col">
                          <label className="text-[10px] font-mono font-bold uppercase text-gray-500 dark:text-gray-400 mb-1.5">
                            <ZoomIn className="w-3 h-3 inline mr-1" />
                            Detección Individual ({filteredResults.length})
                          </label>
                          <select
                            value={selectedDetectionId ?? ""}
                            onChange={(e) => setSelectedDetectionId(e.target.value || null)}
                            className={selectClasses}
                          >
                            <option value="">-- Seleccionar para zoom --</option>
                            {filteredResults.map((r, idx) => (
                              <option key={r.id} value={r.id}>
                                #{idx + 1} — {formatPestDisplayName(r.diagnosis)} ({(r.confidence * 100).toFixed(1)}%)
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>

                    {/* Canvas + Detail */}
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className={`${selectedDetection ? "w-full md:w-1/2" : "w-full md:w-2/3"} aspect-square rounded-xl overflow-hidden relative`}>
                        <HistoryImageCanvas
                          image={selectedImage}
                          visibleResults={filteredResults}
                          highlightedResultId={selectedDetectionId}
                        />
                      </div>

                      <div className={`${selectedDetection ? "w-full md:w-1/2" : "w-full md:w-1/3"} flex flex-col gap-3`}>
                        {/* Zoom Preview */}
                        {selectedDetection && selectedDetection.boundingBox && (
                          <div>
                            <p className="text-[10px] font-mono font-bold uppercase text-[#00ff9d] mb-1.5 flex items-center gap-1">
                              <ZoomIn className="w-3 h-3" /> Vista Ampliada
                            </p>
                            <DetectionZoomPreview
                              imageUrl={selectedImage.url}
                              boundingBox={selectedDetection.boundingBox}
                            />
                            <div className="mt-2 bg-gray-50 dark:bg-black/30 rounded-lg p-3 space-y-1">
                              <div className="flex justify-between">
                                <span className="text-[10px] text-gray-500">Plaga</span>
                                <span className="text-[10px] font-bold text-gray-800 dark:text-gray-200">{formatPestDisplayName(selectedDetection.diagnosis)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-[10px] text-gray-500">Confianza</span>
                                <span className="text-[10px] font-bold text-gray-800 dark:text-gray-200">{(selectedDetection.confidence * 100).toFixed(1)}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-[10px] text-gray-500">Modelo</span>
                                <span className="text-[10px] font-bold text-gray-800 dark:text-gray-200">{formatModelDisplayName(selectedDetection.model?.name || "Desconocido")}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Image-level Findings */}
                        <div className="space-y-3">
                          {selectedImage.imageRecommendation && (
                            <div>
                              <p className="text-[10px] font-mono font-bold uppercase text-gray-500 dark:text-gray-400">Hallazgo Específico</p>
                              <p className="text-sm text-gray-800 dark:text-gray-200">{selectedImage.imageRecommendation}</p>
                            </div>
                          )}
                          {selectedImage.recommendedProduct && (
                            <div>
                              <p className="text-[10px] font-mono font-bold uppercase text-gray-500 dark:text-gray-400">Producto Sugerido</p>
                              <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{selectedImage.recommendedProduct}</p>
                            </div>
                          )}
                          {selectedImage.operativeGuide && (
                            <div>
                              <p className="text-[10px] font-mono font-bold uppercase text-gray-500 dark:text-gray-400">Guía Operativa</p>
                              <p className="text-sm text-gray-800 dark:text-gray-200 italic">{selectedImage.operativeGuide}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Audio Comments */}
          {!data.comment ? (
            <AudioRecorder analysisId={id as string} />
          ) : (
            <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-none">
              <h3 className="text-sm font-black tracking-tighter italic text-emerald-600 dark:text-[#00ff9d] uppercase mb-4">
                Comentarios Adicionales Procesados
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-mono font-bold uppercase text-gray-500 mb-1">Tu Audio / Transcripción</p>
                  <p className="text-sm text-gray-800 dark:text-gray-200 italic">&ldquo;{data.comment.transcription}&rdquo;</p>
                </div>
                {data.comment.diagnosis && (
                  <div>
                    <p className="text-[10px] font-mono font-bold uppercase text-gray-500 mb-1">Nuevo Diagnóstico IA</p>
                    <p className="text-sm text-gray-800 dark:text-gray-200">{data.comment.diagnosis}</p>
                  </div>
                )}
                {data.comment.treatment && (
                  <div>
                    <p className="text-[10px] font-mono font-bold uppercase text-gray-500 mb-1">Nuevo Tratamiento IA</p>
                    <p className="text-sm text-gray-800 dark:text-gray-200">{data.comment.treatment}</p>
                  </div>
                )}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
                  <p className="text-[10px] font-mono font-bold uppercase text-gray-500 mb-2">Escuchar Audio Original</p>
                  <audio src={data.comment.audioUrl} controls className="h-10 outline-none w-full max-w-sm" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <BiosecurityCard
            status={isInfected ? "EN CUARENTENA / RIESGO" : "VIGILANCIA PREVENTIVA"}
            protocol={generalBiosecurityProtocol || "No requiere medidas adicionales."}
          />
        </div>
      </div>
    </div>
  );
}
