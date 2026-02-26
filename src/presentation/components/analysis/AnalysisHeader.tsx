import Link from "next/link";
import { ArrowLeft, Dna, Leaf } from "lucide-react";

export function AnalysisHeader() {
  return (
    <header className="flex items-center justify-between mb-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="p-2.5 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl border border-gray-200 dark:border-white/5 transition-all group"
        >
          <ArrowLeft className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 shadow-[0_0_15px_rgba(0,255,157,0.1)]">
            <Dna className="w-6 h-6 text-emerald-600 dark:text-[#00ff9d]" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tighter uppercase italic">
              TOMATO<span className="text-emerald-600 dark:text-[#00ff9d]">CODE</span>
            </h1>
            <div className="flex items-center gap-2">
              <Leaf className="w-3 h-3 text-emerald-500/50 dark:text-[#00ff9d]/50" />
              <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-mono">
                Diagnostico Neuronal de Patogenos
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:block text-right">
          <div className="flex items-center gap-2 justify-end">
            <span className="w-1.5 h-1.5 bg-emerald-500 dark:bg-[#00ff9d] rounded-full animate-pulse dark:shadow-[0_0_5px_#00ff9d]"></span>
            <p className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
              NUCLEO-ML LISTO
            </p>
          </div>
          <p className="text-[9px] text-gray-400 dark:text-gray-600 font-mono">LATENCIA: 42ms</p>
        </div>
      </div>
    </header>
  );
}
