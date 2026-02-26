import { motion } from "framer-motion";
import { ChevronRight, ShieldAlert } from "lucide-react";

interface AnalysisErrorBannerProps {
  error: string | null;
  onClose: () => void;
}

export function AnalysisErrorBanner({ error, onClose }: AnalysisErrorBannerProps) {
  if (!error) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-8 left-8 right-8 z-50 bg-[#ff003c] text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <ShieldAlert className="w-5 h-5" />
        <span className="text-xs font-bold font-mono tracking-tight">{error}</span>
      </div>
      <button onClick={onClose} className="p-2 hover:bg-black/20 rounded-lg">
        <ChevronRight className="w-5 h-5 rotate-90" />
      </button>
    </motion.div>
  );
}
