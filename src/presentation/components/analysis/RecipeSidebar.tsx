import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Cpu, ShieldCheck, TrendingUp, Zap } from "lucide-react";
import type { AgronomicRecipe, Detection } from "./types";

interface RecipeSidebarProps {
  recipe: AgronomicRecipe | null;
  primaryDetection: Detection | null;
}

export function RecipeSidebar({ recipe, primaryDetection }: RecipeSidebarProps) {
  return (
    <aside className="lg:col-span-4 flex flex-col gap-6">
      <div className="bg-white dark:bg-[#111] dark:backdrop-blur-xl p-8 rounded-[2rem] border border-gray-200 dark:border-white/5 flex flex-col h-full shadow-sm dark:shadow-none">
        <h2 className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
          <span className="w-2 h-2 bg-emerald-500 dark:bg-[#00ff9d] rounded-full"></span>
          REGISTRO AGRI-RECETA
        </h2>

        <AnimatePresence mode="wait">
          {recipe ? (
            <motion.div
              key={primaryDetection?.pest}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.15 },
                },
              }}
              className="space-y-8"
            >
              <motion.div
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1 },
                }}
              >
                <p className="text-[10px] font-mono text-gray-400 dark:text-gray-600 uppercase mb-2">
                  Patogeno Objetivo
                </p>
                <div className="flex items-center gap-4">
                  <h3 className="text-4xl font-black italic tracking-tighter uppercase text-gray-900 dark:text-white dark:drop-shadow-[0_0_20px_#ff003c44]">
                    {primaryDetection?.pest}
                  </h3>
                  <div className="px-3 py-1 bg-[#ff003c] text-white text-[10px] font-black rounded border-2 border-red-300 dark:border-white/10 shadow-lg dark:shadow-[0_0_15px_#ff003c]">
                    POS
                  </div>
                </div>
              </motion.div>

              <div className="space-y-6">
                <motion.div
                  variants={{
                    hidden: { x: 20, opacity: 0 },
                    visible: { x: 0, opacity: 1 },
                  }}
                  className="group relative"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#FFA500]/20 to-transparent rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                  <div className="relative p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-200 dark:border-white/5 group-hover:border-[#FFA500]/40 transition-all duration-300">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-orange-50 dark:bg-[#FFA500]/10 rounded-2xl">
                        <Zap className="w-5 h-5 text-[#FFA500]" />
                      </div>
                      <p className="text-[11px] font-mono text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                        Producto Recomendado
                      </p>
                    </div>
                    <p className="text-xl font-black leading-tight italic text-gray-900 dark:text-white">
                      {recipe.product}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  variants={{
                    hidden: { x: 20, opacity: 0 },
                    visible: { x: 0, opacity: 1 },
                  }}
                  className="group relative"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-transparent rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                  <div className="relative p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-200 dark:border-white/5 group-hover:border-blue-400/40 transition-all duration-300">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-2xl">
                        <TrendingUp className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                      </div>
                      <p className="text-[11px] font-mono text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                        Dosis de Aplicacion
                      </p>
                    </div>
                    <p className="text-xl font-black leading-tight italic text-gray-900 dark:text-white">
                      {recipe.dose}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  variants={{
                    hidden: { x: 20, opacity: 0 },
                    visible: { x: 0, opacity: 1 },
                  }}
                  className="relative p-6 bg-emerald-50 dark:bg-[#00ff9d]/5 rounded-3xl border-2 border-emerald-200 dark:border-[#00ff9d]/20 shadow-sm dark:shadow-[0_0_30px_#00ff9d0a] overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
                    <ShieldCheck className="w-16 h-16 text-emerald-500 dark:text-[#00ff9d]" />
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-emerald-100 dark:bg-[#00ff9d]/20 rounded-2xl dark:shadow-[0_0_15px_#00ff9d22]">
                      <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-[#00ff9d]" />
                    </div>
                    <p className="text-[11px] font-mono text-emerald-700 dark:text-[#00ff9d] uppercase font-black tracking-widest">
                      Guia Operativa
                    </p>
                  </div>
                  <p className="text-sm text-emerald-800 dark:text-emerald-100/80 leading-relaxed font-bold italic relative z-10">
                    {recipe.method}
                  </p>
                </motion.div>
              </div>

              <motion.div
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1 },
                }}
                className="pt-8 border-t border-gray-200 dark:border-white/5"
              >
                <button className="group w-full py-5 bg-gray-100 dark:bg-white/5 border-2 border-gray-200 dark:border-white/10 rounded-3xl text-[11px] font-mono text-gray-500 uppercase tracking-[0.3em] hover:bg-emerald-50 dark:hover:bg-[#00ff9d]/10 hover:border-emerald-400 dark:hover:border-[#00ff9d]/50 hover:text-gray-900 dark:hover:text-white transition-all duration-300 flex items-center justify-center gap-4">
                  <span>Generar Reporte PDF</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30 grayscale saturate-0">
              <Cpu className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-6" />
              <p className="text-[10px] font-mono uppercase tracking-[0.2em]">
                Esperando Buffer de Datos...
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
}
