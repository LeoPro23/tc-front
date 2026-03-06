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
} from "recharts";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const chartData = [
  { month: "Jan", whitefly: 12, aphids: 8, mites: 5 },
  { month: "Feb", whitefly: 15, aphids: 12, mites: 7 },
  { month: "Mar", whitefly: 18, aphids: 15, mites: 10 },
  { month: "Apr", whitefly: 22, aphids: 18, mites: 12 },
  { month: "May", whitefly: 28, aphids: 22, mites: 15 },
  { month: "Jun", whitefly: 25, aphids: 20, mites: 13 },
  { month: "Jul", whitefly: 20, aphids: 16, mites: 10 },
];

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
                1,284
              </h3>
              <p className="text-[10px] text-emerald-600 dark:text-[#00ff9d] mt-2 font-mono">
                +12.4% INCREMENTO
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
              <h3 className="text-4xl font-bold font-mono tracking-tighter text-[#ff003c]">
                18.5%
              </h3>
              <p className="text-[10px] text-[#ff003c] mt-2 font-mono">
                RIESGO: ELEVADO
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
                Nodos Activos
              </p>
              <h3 className="text-4xl font-bold font-mono tracking-tighter text-emerald-600 dark:text-[#00ff9d]">
                07
              </h3>
              <p className="text-[10px] text-gray-500 mt-2 font-mono">
                CONEXIÓN ESTABLE
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

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-10">
              <div className="relative">
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

              <div className="text-left">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 bg-emerald-500 dark:bg-[#00ff9d] rounded-full animate-pulse dark:shadow-[0_0_10px_#00ff9d]"></div>
                  <p className="text-[11px] text-emerald-600 dark:text-[#00ff9d] font-mono tracking-[0.5em] uppercase font-black">
                    CARGA NEURAL BIOMÉTRICA // NIVEL_AUTH: 3
                  </p>
                </div>
                <h2 className="text-5xl font-black italic tracking-tight uppercase leading-none mb-2 group-hover:translate-x-2 transition-transform duration-500">
                  INICIAR{" "}
                  <span className="text-emerald-600 dark:text-[#00ff9d] dark:drop-shadow-[0_0_15px_rgba(0,255,157,0.4)]">
                    ESCANEO NEURAL
                  </span>
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium tracking-tight max-w-lg">
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
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Analíticas de Detección
              </h2>
              <p className="text-sm text-gray-500 font-mono">
                DISTRIBUCIÓN TEMPORAL DE PLAGAS
              </p>
            </div>
            <select className="bg-gray-100 dark:bg-black/40 border border-gray-200 dark:border-white/10 text-xs px-4 py-2 rounded-lg font-mono outline-none text-gray-900 dark:text-white">
              <option>ÚLTIMA VISTA (7 DÍAS)</option>
              <option>ANÁLISIS 30 DÍAS</option>
            </select>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient
                    id="colorWhitefly"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#ff003c" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ff003c" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorMites" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff9d" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00ff9d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  className="dark:[&>line]:!stroke-[#222]"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
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
                <Area
                  type="monotone"
                  dataKey="whitefly"
                  stroke="#ff003c"
                  fillOpacity={1}
                  fill="url(#colorWhitefly)"
                  strokeWidth={3}
                />
                <Area
                  type="monotone"
                  dataKey="mites"
                  stroke="#00ff9d"
                  fillOpacity={1}
                  fill="url(#colorMites)"
                  strokeWidth={3}
                />
              </AreaChart>
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
