"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { managementApi } from "@/lib/api/management.service";
import type { AnalysisFieldCampaignHistory } from "@/lib/api/management.types";
import { AnalysisHeader, BiosecurityCard } from "@/presentation/components/analysis";
import { ArrowLeft } from "lucide-react";
import { ImageWithFallback } from "@/presentation/components/figma/ImageWithFallback";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function ScanHistoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [data, setData] = useState<AnalysisFieldCampaignHistory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
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
    operativeGuide,
    biosecurityProtocol: generalBiosecurityProtocol,
    fieldCampaign,
    attachedImages,
  } = data;

  const severity = isInfected ? "HIGH" : "LOW";
  const mainPest = primaryTargetPest || (isInfected ? "PLAGA DESCONOCIDA" : "SALUDABLE");
  
  const selectedImage = attachedImages ? attachedImages[activeTab] : null;

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">
      <Link href="/scan-history" className="inline-flex items-center text-emerald-600 dark:text-[#00ff9d] hover:underline mb-4 font-bold text-sm">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Volver al historial
      </Link>

      <AnalysisHeader />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Summary & General Assessment */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* General Summary */}
          <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-none">
            <h2 className="text-lg font-black tracking-tighter italic text-gray-900 dark:text-white uppercase mb-3 text-emerald-600">
              Resumen del Lote
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {generalSummary || "Sin resumen disponible."}
            </p>

            <h3 className="text-sm font-black tracking-tighter italic text-gray-900 dark:text-white uppercase mb-2">Recomendación General</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              {generalRecommendation || "Sin recomendación."}
            </p>
          </div>

          <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-none">
             <h3 className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest mb-4">Lote Analizado</h3>
             <div className="flex gap-4">
                <div>
                   <p className="text-xs font-bold text-gray-900 dark:text-gray-300">Campaña</p>
                   <p className="text-xs text-gray-700 dark:text-gray-400">{fieldCampaign?.campaign?.startDate} a {fieldCampaign?.campaign?.endDate}</p>
                </div>
                <div>
                   <p className="text-xs font-bold text-gray-900 dark:text-gray-300">Campo</p>
                   <p className="text-xs text-gray-700 dark:text-gray-400">{fieldCampaign?.field?.name}</p>
                </div>
                <div>
                   <p className="text-xs font-bold text-gray-900 dark:text-gray-300">Fecha de Escaneo</p>
                   <p className="text-xs text-gray-700 dark:text-gray-400">{new Date(date).toLocaleString()}</p>
                </div>
             </div>
          </div>

          {/* Attached Images Viewer */}
          {attachedImages && attachedImages.length > 0 && (
            <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-none">
               <h3 className="text-sm font-black tracking-tighter italic text-gray-900 dark:text-white uppercase mb-4">Evidencias Capturadas ({attachedImages.length})</h3>
               
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
                      className="flex flex-col md:flex-row gap-6 bg-gray-50 dark:bg-black/20 rounded-xl p-4"
                   >
                     <div className="w-full md:w-1/2 aspect-square rounded-xl overflow-hidden bg-gray-200 dark:bg-white/5">
                        <ImageWithFallback src={selectedImage.url} alt="Evidencia seleccionada" className="w-full h-full object-contain" />
                     </div>
                     <div className="w-full md:w-1/2 flex flex-col gap-3">
                        <div>
                          <p className="text-[10px] font-mono font-bold uppercase text-gray-500">Hallazgo Específico</p>
                          <p className="text-sm text-gray-800 dark:text-gray-200">{selectedImage.imageRecommendation}</p>
                        </div>
                        {selectedImage.recommendedProduct && (
                          <div>
                            <p className="text-[10px] font-mono font-bold uppercase text-gray-500">Producto Sugerido</p>
                            <p className="text-sm text-gray-800 dark:text-gray-200">{selectedImage.recommendedProduct}</p>
                          </div>
                        )}
                        {selectedImage.operativeGuide && (
                          <div>
                            <p className="text-[10px] font-mono font-bold uppercase text-gray-500">Guía Operativa</p>
                            <p className="text-sm text-gray-800 dark:text-gray-200">{selectedImage.operativeGuide}</p>
                          </div>
                        )}
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>
          )}
        </div>

        {/* Right Column - Biosecurity */}
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
