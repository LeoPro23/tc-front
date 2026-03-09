"use client";

import { AnimatePresence, motion } from "framer-motion";
import NextImage from "next/image";
import { Dna, Search, ShieldCheck, Target, Upload } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ChangeEvent, RefObject } from "react";
import type { Detection, ImageAnalysisEntry, ImageNaturalSize, ImageRect } from "./types";

interface AnalysisCanvasPanelProps {
  selectedImage: string | null;
  selectedEntry: ImageAnalysisEntry | null;
  detections: Detection[];
  filteredDetections: Detection[];
  isScanning: boolean;
  scanLogs: string[];
  imageEntriesCount: number;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onUploadChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onClearImageEntries: () => void;
  onReprocess: () => void;
}

export function AnalysisCanvasPanel({
  selectedImage,
  selectedEntry,
  detections,
  filteredDetections,
  isScanning,
  scanLogs,
  imageEntriesCount,
  fileInputRef,
  onUploadChange,
  onClearImageEntries,
  onReprocess,
}: AnalysisCanvasPanelProps) {
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

    setImgRect({
      left: (cw - rw) / 2,
      top: (ch - rh) / 2,
      width: rw,
      height: rh,
    });
  }, [imgNaturalSize]);

  useEffect(() => {
    if (!selectedImage) {
      setImgNaturalSize(null);
      setImgRect(null);
      return;
    }

    const img = new window.Image();
    img.onload = () => {
      setImgNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
    };
    img.src = selectedImage;
  }, [selectedImage]);

  useEffect(() => {
    computeImgRect();
    const container = containerRef.current;
    if (!container) return;

    const ro = new ResizeObserver(() => computeImgRect());
    ro.observe(container);
    return () => ro.disconnect();
  }, [computeImgRect]);

  return (
    <div className="bg-white dark:bg-black/40 dark:backdrop-blur-xl rounded-3xl overflow-hidden relative aspect-video flex items-center justify-center border border-gray-200 dark:border-white/5 group shadow-sm dark:shadow-none">
      <AnimatePresence mode="wait">
        {!selectedImage ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex flex-col items-center text-center p-12 cursor-pointer w-full h-full justify-center"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-emerald-500/20 dark:bg-[#00ff9d]/20 blur-3xl rounded-full"></div>
              <div className="w-24 h-24 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center relative z-10 group-hover:border-emerald-400/50 dark:group-hover:border-[#00ff9d]/50 transition-colors">
                <Upload className="w-10 h-10 text-emerald-600 dark:text-[#00ff9d] animate-bounce" />
              </div>
            </div>
            <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-2">
              Inicializar Escaneo
            </h2>
            <p className="text-gray-500 max-w-sm mb-8 text-sm font-medium">
              Suba imagenes hiperespectrales de hojas para procesamiento neural profundo e
              identificacion de patogenos.
            </p>
            <div className="flex items-center gap-4">
              <div className="h-[1px] w-8 bg-gray-200 dark:bg-white/10"></div>
              <span className="text-[10px] font-mono text-gray-400 dark:text-gray-600 tracking-widest uppercase">
                Seleccionar Fuente
              </span>
              <div className="h-[1px] w-8 bg-gray-200 dark:bg-white/10"></div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative w-full h-full flex items-center justify-center bg-gray-100 dark:bg-black/60"
          >
            <div ref={containerRef} className="relative w-full h-full">
              <NextImage
                src={selectedImage}
                alt="Muestra"
                fill
                className={`object-contain transition-all duration-700 ${
                  isScanning
                    ? "brightness-75 contrast-125 saturate-[1.2] hue-rotate-[90deg]"
                    : "brightness-100"
                }`}
                unoptimized={selectedImage.startsWith("blob:")}
              />
            </div>

            <AnimatePresence>
              {isScanning && (
                <>
                  <motion.div
                    initial={{ top: "-10%" }}
                    animate={{ top: "110%" }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00ff9d] to-transparent shadow-[0_0_20px_#00ff9d] z-20"
                  />
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
                  <motion.div
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="absolute inset-0 border-[20px] border-[#00ff9d]/5 pointer-events-none"
                  ></motion.div>
                </>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isScanning && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-40 bg-black/40 backdrop-blur-[2px] overflow-hidden flex items-center justify-center"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#00ff9d0d_1px,transparent_1px),linear-gradient(to_bottom,#00ff9d0d_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

                  <div className="relative w-64 h-64 flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute inset-0 border-2 border-dashed border-[#00ff9d]/20 rounded-full"
                    />
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.1, 0.4, 0.1],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-4 border-4 border-[#00ff9d] rounded-full shadow-[0_0_30px_#00ff9d]"
                    />
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute inset-10 border border-[#00ff9d]/40 rounded-full border-t-transparent"
                    />
                    <div className="flex flex-col items-center z-10">
                      <Dna className="w-12 h-12 text-[#00ff9d] animate-pulse mb-3" />
                      <span className="text-[10px] font-mono text-[#00ff9d] font-black tracking-[0.4em] animate-pulse">
                        ESCANEANDO...
                      </span>
                    </div>
                  </div>

                  <motion.div
                    animate={{ top: ["10%", "90%"] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute left-0 w-full h-[2px] bg-[#00ff9d] shadow-[0_0_25px_5px_#00ff9d] z-50"
                  >
                    <div className="absolute top-0 right-4 transform -translate-y-full text-[8px] font-mono text-[#00ff9d] animate-pulse">
                      ESCANEANDO_ADN_SUPERFICIAL...
                    </div>
                  </motion.div>

                  <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none">
                    <div className="flex justify-between">
                      <div className="w-12 h-12 border-t-2 border-l-2 border-[#00ff9d]"></div>
                      <div className="w-12 h-12 border-t-2 border-r-2 border-[#00ff9d]"></div>
                    </div>
                    <div className="flex justify-between">
                      <div className="w-12 h-12 border-b-2 border-l-2 border-[#00ff9d]"></div>
                      <div className="w-12 h-12 border-b-2 border-r-2 border-[#00ff9d]"></div>
                    </div>
                  </div>

                  <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-xl group">
                    <div className="bg-black/90 border-2 border-[#00ff9d]/30 rounded-2xl p-6 font-mono text-[11px] uppercase tracking-widest text-[#00ff9d] shadow-[0_0_50px_rgba(0,255,157,0.2)]">
                      <div className="flex items-center justify-between mb-4 border-b border-[#00ff9d]/20 pb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 bg-[#00ff9d] rounded-full animate-ping"></div>
                          <span className="font-black italic">NUCLEO NEURAL ML-AGRI // v4.0.2</span>
                        </div>
                        <div className="flex gap-1">
                          <div className="w-4 h-1 bg-[#00ff9d]"></div>
                          <div className="w-1 h-1 bg-[#00ff9d]/30"></div>
                        </div>
                      </div>
                      <div className="space-y-2 h-24 overflow-hidden">
                        {scanLogs.map((log, i) => (
                          <motion.p
                            key={i}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="flex items-center gap-3"
                          >
                            <span className="text-[#00ff9d]/40">
                              [
                              {new Date().toLocaleTimeString("en-US", {
                                hour12: false,
                                minute: "2-digit",
                                second: "2-digit",
                              })}
                              ]
                            </span>
                            <span className="text-white brightness-125 font-bold">{log}</span>
                          </motion.p>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!isScanning &&
              filteredDetections.map((det, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                  className="absolute border-2 border-[#ff003c] rounded-lg shadow-[0_0_30px_rgba(255,0,60,0.4)] z-30 pointer-events-none group/box"
                  style={
                    imgRect && imgNaturalSize
                      ? {
                          left: `${
                            imgRect.left + (det.box[0] / imgNaturalSize.w) * imgRect.width
                          }px`,
                          top: `${imgRect.top + (det.box[1] / imgNaturalSize.h) * imgRect.height}px`,
                          width: `${
                            ((det.box[2] - det.box[0]) / imgNaturalSize.w) * imgRect.width
                          }px`,
                          height: `${
                            ((det.box[3] - det.box[1]) / imgNaturalSize.h) * imgRect.height
                          }px`,
                        }
                      : { display: "none" }
                  }
                >
                  <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white -translate-x-1 -translate-y-1"></div>
                  <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white translate-x-1 -translate-y-1"></div>
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white -translate-x-1 translate-y-1"></div>
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white translate-x-1 translate-y-1"></div>

                  <div className="absolute -top-10 left-0 flex flex-col gap-1 drop-shadow-2xl">
                    <div className="px-3 py-1 bg-[#ff003c] text-white text-[10px] font-black uppercase tracking-tighter italic flex items-center gap-2 rounded-t-md border-b-2 border-black/20">
                      <Target className="w-3.5 h-3.5" /> {det.pest}
                    </div>
                    <div className="bg-white text-black text-[9px] font-black px-2 py-0.5 rounded-b-md flex justify-between gap-4">
                      <span>CONFIANZA</span>
                      <span>{det.confidence}%</span>
                      <span className="max-w-28 truncate uppercase">{det.model}</span>
                    </div>
                  </div>
                </motion.div>
              ))}

            {!isScanning &&
              selectedImage &&
              detections.length === 0 &&
              selectedEntry?.verified !== false && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-emerald-50 dark:bg-[#00ff9d]/10 dark:backdrop-blur-xl border-2 border-emerald-400 dark:border-[#00ff9d]/50 px-10 py-6 rounded-3xl z-40 shadow-lg dark:shadow-[0_0_40px_rgba(0,255,157,0.2)]"
                >
                  <div className="flex flex-col items-center gap-2">
                    <ShieldCheck className="w-12 h-12 text-emerald-600 dark:text-[#00ff9d] mb-2" />
                    <h2 className="text-2xl font-black italic tracking-tighter uppercase">
                      BIOMASA SALUDABLE
                    </h2>
                    <p className="text-emerald-600 dark:text-[#00ff9d] text-[10px] font-mono tracking-widest font-black">
                      SIN FIRMAS DE PATOGENOS
                    </p>
                  </div>
                </motion.div>
              )}

            {!isScanning && selectedImage && selectedEntry?.verified === false && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-amber-50 dark:bg-amber-500/10 dark:backdrop-blur-xl border-2 border-amber-400 dark:border-amber-300/60 px-8 py-5 rounded-3xl z-40 shadow-lg"
              >
                <div className="flex flex-col items-center gap-2 max-w-md text-center">
                  <h2 className="text-lg font-black italic tracking-tighter uppercase">
                    Imagen No Valida Para Analisis
                  </h2>
                  <p className="text-amber-700 dark:text-amber-200 text-[10px] font-mono tracking-widest font-black">
                    {selectedEntry.verificationReason ??
                      "No corresponde a cultivo/plaga agrícola."}
                  </p>
                </div>
              </motion.div>
            )}

            {!isScanning && selectedImage && detections.length > 0 && filteredDetections.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-gray-50 dark:bg-white/10 dark:backdrop-blur-xl border-2 border-gray-300 dark:border-white/20 px-8 py-5 rounded-3xl z-40 shadow-lg"
              >
                <div className="flex flex-col items-center gap-1">
                  <h2 className="text-lg font-black italic tracking-tighter uppercase">
                    Sin Objetivos Visibles
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-[10px] font-mono tracking-widest font-black">
                    AJUSTA EL FILTRO DE MODELOS
                  </p>
                </div>
              </motion.div>
            )}

            {!isScanning && filteredDetections.length > 0 && (
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <div className="px-3 py-1.5 bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-lg border border-gray-200 dark:border-white/10 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ff003c] animate-pulse"></div>
                  <span className="text-[10px] font-mono font-bold uppercase">
                    Amenaza Identificada
                  </span>
                </div>
              </div>
            )}

            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center pointer-events-none">
              <div className="flex gap-2 pointer-events-auto">
                <button
                  onClick={onClearImageEntries}
                  className="p-3 bg-white/60 dark:bg-black/60 backdrop-blur-xl rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 transition-all group"
                >
                  <Upload className="w-5 h-5 text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white" />
                </button>
              </div>
              {!isScanning && (
                <button
                  onClick={onReprocess}
                  disabled={imageEntriesCount === 0}
                  className="px-6 py-3 bg-emerald-100 dark:bg-[#00ff9d]/20 dark:backdrop-blur-xl rounded-xl border border-emerald-400 dark:border-[#00ff9d]/30 text-emerald-700 dark:text-[#00ff9d] text-xs font-black italic tracking-widest flex items-center gap-3 pointer-events-auto hover:bg-emerald-200 dark:hover:bg-[#00ff9d]/30 transition-all shadow-sm dark:shadow-[0_0_20px_rgba(0,255,157,0.1)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Search className="w-4 h-4" /> RE-PROCESAR ENLACE NEURAL
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <input
        type="file"
        ref={fileInputRef}
        onChange={onUploadChange}
        className="hidden"
        accept="image/*"
        multiple
      />
    </div>
  );
}
