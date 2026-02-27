import { ShieldAlert } from "lucide-react";

interface BiosecurityCardProps {
  status: string;
  protocol: string;
}

export function BiosecurityCard({ status, protocol }: BiosecurityCardProps) {
  return (
    <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl p-6 rounded-3xl border border-gray-200 dark:border-white/5 border-l-[#ff003c] border-l-4 shadow-sm dark:shadow-none">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-2.5 bg-red-50 dark:bg-[#ff003c]/10 rounded-xl border border-red-200 dark:border-[#ff003c]/20">
          <ShieldAlert className="w-5 h-5 text-[#ff003c]" />
        </div>
        <div>
          <h3 className="font-black italic text-xs text-gray-600 dark:text-gray-300 uppercase tracking-widest">
            Protocolo de Bioseguridad
          </h3>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">
            ESTADO: {status}
          </p>
        </div>
      </div>
      <p className="text-[11px] text-gray-500 leading-relaxed italic">{protocol}</p>
    </div>
  );
}
