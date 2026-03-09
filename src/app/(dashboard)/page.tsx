"use client";

import {
  Scan,
  AlertTriangle,
  Upload,
  Zap,
  Activity,
  Dna,
  Cpu,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { managementApi } from "@/lib/api/management.service";
import type { CampaignMetrics, PestsTemporalResponse, FieldsTemporalResponse, FieldCampaign } from "@/lib/api/management.types";

export type ChartMode = 'pest' | 'field';

const recentScans = [
  {
    id: "1",
    image:
      "https://images.unsplash.com/photo-1762608292626-a384d1cc401f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b21hdG8lMjBsZWFmJTIwZGlzZWFzZSUyMGNsb3NldXB8ZW58MXx8fHwxNzcwODY4NTcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    status: "infected" as const,
    pest: "Infestación de Mosca Blanca",
    confidence: 98,
    timestamp: "Hace 2 horas",
  },
  {
    id: "2",
    image:
      "https://images.unsplash.com/photo-1768113802430-dcb7c874407f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwdG9tYXRvJTIwcGxhbnQlMjBsZWFmfGVufDF8fHx8MTc3MDg2ODU3Mnww&ixlib=rb-4.1.0&q=80&w=1080",
    status: "healthy" as const,
    confidence: 95,
    timestamp: "Hace 5 horas",
  },
  {
    id: "3",
    image:
      "https://images.unsplash.com/photo-1720487222334-f91d9d74c852?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b21hdG8lMjBncmVlbmhvdXNlJTIwYWdyaWN1bHR1cmV8ZW58MXx8fHwxNzcwODY4NTcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    status: "healthy" as const,
    confidence: 92,
    timestamp: "Hace 1 día",
  },
];

export default function Dashboard() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<CampaignMetrics | null>(null);
  const [temporalData, setTemporalData] = useState<PestsTemporalResponse | null>(null);
  const [fieldsTemporalData, setFieldsTemporalData] = useState<FieldsTemporalResponse | null>(null);
  const [campaignFields, setCampaignFields] = useState<FieldCampaign[]>([]);

  const [chartMode, setChartMode] = useState<ChartMode>('pest');
  const [selectedFieldIds, setSelectedFieldIds] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const campaigns = await managementApi.getCampaigns();
        const activeCampaign = campaigns.find(c => c.isActive);

        if (activeCampaign) {
          const fields = await managementApi.getEnrolledFields(activeCampaign.id);
          setCampaignFields(fields);
        }

        const [metricsData, temporal, fieldsTemporal] = await Promise.all([
          managementApi.getMetrics(),
          managementApi.getPestsTemporal(selectedFieldIds),
          managementApi.getFieldsTemporal(selectedFieldIds)
        ]);

        setMetrics(metricsData);
        setTemporalData(temporal);
        setFieldsTemporalData(fieldsTemporal);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [selectedFieldIds]);

  const toggleFieldSelection = (fieldId: string) => {
    setSelectedFieldIds(prev =>
      prev.includes(fieldId)
        ? prev.filter(id => id !== fieldId)
        : [...prev, fieldId]
    );
  };

  const chartColors = [
    { stopColor: "#ff003c", id: "colorPest0" }, // Red
    { stopColor: "#00ff9d", id: "colorPest1" }, // Green
    { stopColor: "#00bfff", id: "colorPest2" }, // Blue
  ];

  return (
    <div className="p-8 bg-gray-50 dark:bg-[#0a0a0a] min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
      {/* Header with New Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-12 border-b border-gray-200 dark:border-white/5 pb-8"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 shadow-[0_0_15px_rgba(0,255,157,0.1)] flex items-center justify-center w-[52px] h-[52px]">
            <Image
              src="/images/logo-bg-transparent.png"
              alt="PlagaCode Logo"
              width={36}
              height={36}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tighter flex items-center gap-2">
              PLAGACODE{" "}
              <span className="text-emerald-600 dark:text-[#00ff9d] dark:drop-shadow-[0_0_8px_rgba(0,255,157,0.5)]">
                AI
              </span>
            </h1>
            <p className="text-xs text-gray-500 font-mono tracking-[0.2em] uppercase">
              Vigilancia Neuronal de Cultivos
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:block text-right">
            <p className="text-[10px] text-gray-500 font-mono">ENLACE NEURAL</p>
            <p className="text-xs text-emerald-600 dark:text-[#00ff9d] font-bold">ESTABLECIENDO...</p>
          </div>
          <button className="p-2.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors relative">
            <Zap className="w-6 h-6 text-[#FFA500]" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-[#ff003c] rounded-full animate-ping"></span>
          </button>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-white/5 dark:backdrop-blur-xl p-6 rounded-2xl border border-gray-200 dark:border-white/10 border-l-4 border-l-blue-500 shadow-sm dark:shadow-none"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">
                Escaneos Totales
              </p>
              <h3 className="text-4xl font-bold font-mono tracking-tighter">
                {isLoading ? "..." : metrics?.totalScans ?? 0}
              </h3>
              <p className={`text-[10px] mt-2 font-mono ${!isLoading && metrics && metrics.scansChangePercentage < 0 ? 'text-[#ff003c]' : 'text-emerald-600 dark:text-[#00ff9d]'}`}>
                {isLoading ? "..." : `${metrics && metrics.scansChangePercentage > 0 ? '+' : ''}${(metrics?.scansChangePercentage ?? 0).toFixed(1)}% ${metrics && metrics.scansChangePercentage < 0 ? 'DECREMENTO' : 'INCREMENTO'}`}
              </p>
            </div>
            <Scan className="w-6 h-6 text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-white/5 dark:backdrop-blur-xl p-6 rounded-2xl border border-gray-200 dark:border-white/10 border-l-4 border-l-[#ff003c] shadow-sm dark:shadow-none"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">
                Tasa de Infección
              </p>
              <h3 className={`text-4xl font-bold font-mono tracking-tighter ${!isLoading && metrics && metrics.infectionRate > 10 ? 'text-[#ff003c]' : 'text-emerald-600 dark:text-[#00ff9d]'}`}>
                {isLoading ? "..." : `${(metrics?.infectionRate ?? 0).toFixed(1)}%`}
              </h3>
              <p className={`text-[10px] mt-2 font-mono ${!isLoading && metrics && metrics.infectionRate > 10 ? 'text-[#ff003c]' : 'text-emerald-600 dark:text-[#00ff9d]'}`}>
                {isLoading ? "..." : `RIESGO: ${metrics && metrics.infectionRate > 10 ? 'ELEVADO' : 'NORMAL'}`}
              </p>
            </div>
            <AlertTriangle className="w-6 h-6 text-[#ff003c]" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-white/5 dark:backdrop-blur-xl p-6 rounded-2xl border border-gray-200 dark:border-white/10 border-l-4 border-l-emerald-500 dark:border-l-[#00ff9d] shadow-sm dark:shadow-none"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">
                Campos Analizados
              </p>
              <h3 className="text-4xl font-bold font-mono tracking-tighter text-emerald-600 dark:text-[#00ff9d]">
                {isLoading ? "..." : `${(metrics?.activeNodes ?? 0).toString().padStart(2, '0')}/${(metrics?.totalFields ?? 0).toString().padStart(2, '0')}`}
              </h3>
              <p className="text-[10px] text-gray-500 mt-2 font-mono">
                {isLoading ? "..." : "COBERTURA TOTAL"}
              </p>
            </div>
            <Activity className="w-6 h-6 text-emerald-600 dark:text-[#00ff9d]" />
          </div>
        </motion.div>
      </div>

      {/* Main Analysis Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 relative group"
      >
        {/* Elite Tech Border Glow */}
        <div className="absolute -inset-[2px] bg-gradient-to-r from-emerald-500 dark:from-[#00ff9d] via-emerald-400 to-emerald-500 dark:to-[#00ff9d] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>

        <button
          onClick={() => router.push("/analysis")}
          className="relative w-full overflow-hidden rounded-2xl bg-white dark:bg-black border border-gray-200 dark:border-white/10 px-10 py-10 transition-all duration-500 group-hover:border-emerald-500/50 dark:group-hover:border-[#00ff9d]/50 shadow-sm dark:shadow-none"
        >
          {/* Internal Tech Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98105_1px,transparent_1px),linear-gradient(to_bottom,#10b98105_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#00ff9d05_1px,transparent_1px),linear-gradient(to_bottom,#00ff9d05_1px,transparent_1px)] bg-[size:20px_20px]"></div>

          {/* Animated Scanning Light */}
          <motion.div
            animate={{ left: ["-10%", "110%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 w-32 h-full bg-gradient-to-r from-transparent via-emerald-500/5 dark:via-[#00ff9d11] to-transparent skew-x-12"
          />

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 w-full">
              <div className="relative shrink-0">
                {/* Magnetic Energy Orbs */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity }}
                  className="absolute inset-0 bg-emerald-500/10 dark:bg-[#00ff9d]/10 blur-3xl rounded-full"
                ></motion.div>

                <div className="p-6 bg-gray-100 dark:bg-white/5 rounded-2xl border-2 border-gray-200 dark:border-white/10 dark:backdrop-blur-3xl group-hover:bg-emerald-50 dark:group-hover:bg-[#00ff9d]/10 group-hover:border-emerald-400 dark:group-hover:border-[#00ff9d]/40 transition-all duration-500 relative z-10 shadow-sm dark:shadow-[0_0_20px_rgba(0,255,157,0.05)]">
                  <Upload className="w-12 h-12 text-emerald-600 dark:text-[#00ff9d] group-hover:scale-110 transition-transform duration-500" />

                  {/* Corner Accents */}
                  <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-emerald-500 dark:border-[#00ff9d] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-emerald-500 dark:border-[#00ff9d] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>

              <div className="text-center md:text-left flex flex-col items-center md:items-start w-full">
                <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
                  <div className="w-2 h-2 bg-emerald-500 dark:bg-[#00ff9d] rounded-full animate-pulse dark:shadow-[0_0_10px_#00ff9d] shrink-0"></div>
                  <p className="text-[10px] md:text-[11px] text-emerald-600 dark:text-[#00ff9d] font-mono tracking-[0.2em] md:tracking-[0.5em] uppercase font-black text-center md:text-left">
                    CARGA NEURAL BIOMÉTRICA // NIVEL_AUTH: 3
                  </p>
                </div>
                <h2 className="text-4xl md:text-5xl font-black italic tracking-tight uppercase leading-none mb-3 md:mb-2 group-hover:translate-x-0 md:group-hover:translate-x-2 transition-transform duration-500 w-full">
                  INICIAR{" "}
                  <span className="text-emerald-600 dark:text-[#00ff9d] dark:drop-shadow-[0_0_15px_rgba(0,255,157,0.4)] block md:inline">
                    ESCANEO NEURAL
                  </span>
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm font-medium tracking-tight max-w-lg mx-auto md:mx-0">
                  Desplegar clústeres de transformadores de visión (YOLOv8x) para
                  identificación de patógenos a nivel molecular y análisis
                  de vitalidad de cultivos.
                </p>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-12">
              <div className="flex flex-col items-end gap-2">
                <div className="flex gap-1">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 h-4 bg-emerald-500/20 dark:bg-[#00ff9d]/20 skew-x-12"
                    ></div>
                  ))}
                </div>
                <p className="text-[10px] font-mono text-gray-500 dark:text-gray-600">
                  ESTADO DEL SISTEMA
                </p>
                <div className="flex gap-2 font-black text-sm italic tracking-tighter">
                  <span className="text-emerald-600 dark:text-[#00ff9d] dark:brightness-150">ACTIVO</span>
                  <span className="text-gray-300 dark:text-gray-800">//</span>
                  <span className="text-gray-500 dark:text-gray-400">NOMINAL</span>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/5 dark:bg-[#00ff9d]/5 blur-xl rounded-full"></div>
                <div className="w-20 h-20 rounded-2xl border-2 border-gray-200 dark:border-white/5 flex items-center justify-center relative group-hover:border-emerald-400/30 dark:group-hover:border-[#00ff9d]/30 transition-all">
                  <div className="absolute inset-0 border-t-2 border-l-2 border-emerald-500 dark:border-[#00ff9d] rounded-2xl animate-pulse opacity-30"></div>
                  <Dna className="w-8 h-8 text-gray-400 dark:text-gray-700 group-hover:text-emerald-600 dark:group-hover:text-[#00ff9d] transition-colors duration-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="absolute top-4 right-1/4 text-[8px] font-mono text-emerald-500/10 dark:text-[#00ff9d]/20 rotate-90 pointer-events-none">
            0110101011101010111
          </div>
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Analytics Section */}
        <div className="lg:col-span-8 bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-3xl p-8 border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Analíticas de Detección
              </h2>
              <div className="flex items-center gap-4 mt-2">
                <button
                  onClick={() => setChartMode('pest')}
                  className={`text-xs font-mono px-3 py-1 rounded-full transition-colors ${chartMode === 'pest' ? 'bg-emerald-500/10 text-emerald-600 dark:text-[#00ff9d] border-emerald-500/20 border' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                >
                  POR PLAGA
                </button>
                <button
                  onClick={() => setChartMode('field')}
                  className={`text-xs font-mono px-3 py-1 rounded-full transition-colors ${chartMode === 'field' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20 border' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                >
                  POR LOTE
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2 items-end relative">
              <select className="bg-gray-100 dark:bg-black/40 border border-gray-200 dark:border-white/10 text-xs px-4 py-2 rounded-lg font-mono outline-none text-gray-900 dark:text-white">
                <option>ÚLTIMA VISTA (7 DÍAS)</option>
                <option>ANÁLISIS 30 DÍAS</option>
              </select>

              {/* Custom Multi-select for Fields */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="bg-gray-100 dark:bg-black/40 border border-gray-200 dark:border-white/10 text-xs px-4 py-2 rounded-lg font-mono outline-none text-gray-900 dark:text-white flex items-center justify-between w-64"
                >
                  <span className="truncate">
                    {selectedFieldIds.length === 0
                      ? "LOTES SELECCIONADOS (TODOS)"
                      : `LOTES SELECCIONADOS (${selectedFieldIds.length})`}
                  </span>
                  <svg className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl shadow-lg z-50 overflow-hidden">
                    <div className="max-h-60 overflow-y-auto p-2">
                      {campaignFields.map((fc) => (
                        <label
                          key={fc.field.id}
                          className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedFieldIds.includes(fc.field.id)}
                            onChange={() => toggleFieldSelection(fc.field.id)}
                            className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 dark:border-white/20 dark:bg-black"
                          />
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-200 truncate flex-1">
                            {fc.field.name}
                          </span>
                        </label>
                      ))}
                      {campaignFields.length === 0 && (
                        <div className="text-xs text-gray-500 p-2 text-center italic">
                          No hay lotes inscritos
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="h-[350px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              {chartMode === 'pest' ? (
                temporalData?.data && temporalData.data.length > 0 ? (
                  <AreaChart data={temporalData.data}>
                    <defs>
                      {temporalData.topPests.map((pest, index) => (
                        <linearGradient
                          key={`gradient-${index}`}
                          id={chartColors[index]?.id || `colorPest${index}`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="5%" stopColor={chartColors[index]?.stopColor || "#ccc"} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={chartColors[index]?.stopColor || "#ccc"} stopOpacity={0} />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e5e7eb"
                      className="dark:[&>line]:!stroke-[#222]"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="dateStr"
                      stroke="#9ca3af"
                      fontSize={10}
                      fontStyle="italic"
                    />
                    <YAxis stroke="#9ca3af" fontSize={10} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--tooltip-bg, #fff)",
                        border: "1px solid var(--tooltip-border, #e5e7eb)",
                        borderRadius: "12px",
                        color: "var(--tooltip-color, #111)",
                      }}
                      itemStyle={{ fontSize: "12px", fontWeight: "bold" }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', marginTop: '10px' }} />
                    {temporalData.topPests.map((pest, index) => (
                      <Area
                        key={`area-${index}`}
                        type="monotone"
                        dataKey={pest}
                        stroke={chartColors[index]?.stopColor || "#ccc"}
                        fillOpacity={1}
                        fill={`url(#${chartColors[index]?.id || `colorPest${index}`})`}
                        strokeWidth={3}
                      />
                    ))}
                  </AreaChart>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-gray-400 dark:text-gray-500 font-bold tracking-widest text-lg lg:text-xl text-center px-4">
                      NO HAY SUFICIENTES DATOS TEMPORALES DE PLAGAS
                    </div>
                  </div>
                )
              ) : (
                fieldsTemporalData?.data && fieldsTemporalData.data.length > 0 ? (
                  <BarChart data={fieldsTemporalData.data}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e5e7eb"
                      className="dark:[&>line]:!stroke-[#222]"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="dateStr"
                      stroke="#9ca3af"
                      fontSize={10}
                      fontStyle="italic"
                    />
                    <YAxis stroke="#9ca3af" fontSize={10} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--tooltip-bg, #fff)",
                        border: "1px solid var(--tooltip-border, #e5e7eb)",
                        borderRadius: "12px",
                        color: "var(--tooltip-color, #111)",
                      }}
                      itemStyle={{ fontSize: "12px", fontWeight: "bold" }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', marginTop: '10px' }} />
                    {fieldsTemporalData.topFields.map((field, index) => (
                      <Bar
                        key={`bar-${index}`}
                        dataKey={field}
                        stackId="a"
                        fill={chartColors[index]?.stopColor || "#ccc"}
                        radius={index === fieldsTemporalData.topFields.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                        barSize={30}
                      />
                    ))}
                  </BarChart>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-gray-400 dark:text-gray-500 font-bold tracking-widest text-lg lg:text-xl text-center px-4">
                      NO HAY SUFICIENTES DATOS TEMPORALES DE LOTES
                    </div>
                  </div>
                )
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Scans Section */}
        <div className="lg:col-span-4 bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-3xl p-8 border border-gray-200 dark:border-white/5 space-y-6 shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black tracking-tighter uppercase italic">
              Inteligencia Reciente
            </h2>
            <Link
              href="/scan-history"
              className="text-[10px] text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              VER REGISTROS
            </Link>
          </div>

          <div className="space-y-5">
            {recentScans.map((scan) => (
              <motion.div
                key={scan.id}
                whileHover={{ x: 5 }}
                className="flex items-center gap-4 group cursor-pointer"
              >
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10">
                  <Image
                    src={scan.image}
                    alt={scan.pest || "Scan sample"}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div
                    className={`absolute -top-1 -right-1 z-10 w-3 h-3 rounded-full border-2 border-white dark:border-[#0a0a0a] ${scan.status === "infected" ? "bg-[#ff003c]" : "bg-[#00ff9d]"}`}
                  ></div>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold leading-tight uppercase tracking-tight">
                    {scan.pest || "Muestra Saludable"}
                  </p>
                  <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                    {scan.timestamp}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-mono text-gray-400">CONF</p>
                  <p className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                    {scan.confidence}%
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="pt-6 border-t border-gray-200 dark:border-white/5">
            <div className="p-4 bg-gray-100 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/5 flex items-center gap-4">
              <Cpu className="w-10 h-10 text-gray-400 dark:text-gray-500/50" />
              <div>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-none mb-1">
                  MOTOR IA CENTRAL
                </p>
                <p className="text-sm font-bold tracking-tight">
                  VIGILANCIA-NEURAL-V4
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
