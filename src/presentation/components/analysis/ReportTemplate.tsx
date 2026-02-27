import React from "react";
import {
  Leaf,
  ShieldCheck,
  Zap,
  TrendingUp,
  Cpu,
  User as UserIcon,
  Calendar,
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
  const { user, detection, recipe, date } = data;

  return (
    <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
      <div
        ref={containerRef}
        className="w-[800px] bg-[#0a0a0a] text-white p-12 font-sans relative overflow-hidden"
      >
        {/* Background Decorations - Restored for html-to-image */}
        <div className="absolute inset-0 bg-[#0a0a0a]" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(to right, #00ff9d05 1px, transparent 1px), linear-gradient(to bottom, #00ff9d05 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00ff9d]/5 blur-[100px] rounded-full" />

        {/* Header */}
        <div className="relative flex justify-between items-start mb-16 border-b border-white/10 pb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[#FF6347] to-[#32CD32] rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(0,255,157,0.2)]">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter uppercase mr-2">
                TOMATO<span className="text-[#00ff9d]">CODE</span>
              </h1>
              <p className="text-[10px] font-mono text-[#00ff9d]/60 tracking-[0.4em] uppercase">
                AgriTech AI Neural Report
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">
              ID DE REPORTE
            </p>
            <p className="text-sm font-mono text-white/80">
              #{Math.random().toString(36).substr(2, 9).toUpperCase()}
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="relative grid grid-cols-12 gap-10">
          {/* Left Column: Summary */}
          <div className="col-span-12 space-y-8">
            {/* Status Bar */}
            <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-[#00ff9d]" />
                <span className="text-[11px] font-mono text-gray-400 uppercase tracking-widest">
                  Fecha de Análisis
                </span>
                <span className="text-xs font-bold ml-2">{date}</span>
              </div>
              <div className="flex items-center gap-3">
                <Cpu className="w-4 h-4 text-[#00ff9d]" />
                <span className="text-[11px] font-mono text-gray-400 uppercase tracking-widest">
                  Estado
                </span>
                <span className="text-[10px] bg-[#00ff9d]/20 text-[#00ff9d] px-2 py-0.5 rounded border border-[#00ff9d]/30 font-black">
                  VALIDADO
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {/* Operador Info */}
              <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <UserIcon className="w-4 h-4 text-[#00ff9d]" />
                  <h3 className="text-[11px] font-mono text-gray-400 uppercase tracking-widest">
                    Información del Operador
                  </h3>
                </div>
                <p className="text-lg font-bold text-white">
                  {user?.name || "Operador Desconocido"}
                </p>
                <p className="text-xs text-gray-500 font-mono">
                  {user?.email || "n/a"}
                </p>
              </div>

              {/* Detection Result */}
              <div className="bg-white/5 p-6 rounded-3xl border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Cpu className="w-12 h-12 text-[#ff003c]" />
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <ShieldCheck className="w-4 h-4 text-[#ff003c]" />
                  <h3 className="text-[11px] font-mono text-gray-400 uppercase tracking-widest">
                    Detección de Patógeno
                  </h3>
                </div>
                <div className="flex items-baseline gap-3">
                  <p className="text-2xl font-black text-[#ff003c] italic uppercase">
                    {detection?.pest || "Ninguno"}
                  </p>
                  <span className="text-[10px] font-mono text-white/40">
                    {(detection?.confidence || 0 * 100).toFixed(1)}% Confianza
                  </span>
                </div>
              </div>
            </div>

            {/* Agronomic Recipe */}
            <div className="space-y-6">
              <h2 className="text-[11px] font-mono text-[#00ff9d] uppercase tracking-[0.4em] flex items-center gap-3">
                <Zap className="w-4 h-4" />
                Prescripción Agronómica
              </h2>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                  <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-3">
                    Producto Recomendado
                  </p>
                  <p className="text-xl font-bold italic text-white leading-tight">
                    {recipe?.product}
                  </p>
                </div>
                <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                  <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-3">
                    Dosis de Aplicación
                  </p>
                  <p className="text-xl font-bold italic text-white leading-tight">
                    {recipe?.dose}
                  </p>
                </div>
              </div>

              <div className="bg-[#00ff9d]/5 p-8 rounded-3xl border border-[#00ff9d]/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5">
                  <ShieldCheck className="w-20 h-20 text-[#00ff9d]" />
                </div>
                <h4 className="text-[10px] font-mono text-[#00ff9d] uppercase tracking-[0.3em] font-black mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Guía Operativa Detallada
                </h4>
                <p className="text-sm text-gray-300 leading-relaxed italic font-medium relative z-10">
                  {recipe?.method}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative mt-20 pt-8 border-t border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00ff9d] animate-pulse shadow-[0_0_10px_#00ff9d]" />
            <span className="text-[9px] font-mono text-gray-500 tracking-widest uppercase">
              Verified by TomatoCode Core v4.2.1-LTS
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
