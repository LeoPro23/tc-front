import { ImageWithFallback } from "../components/figma/ImageWithFallback";

interface ScanItemProps {
  id: string;
  image: string;
  status: "healthy" | "infected";
  pest?: string;
  confidence: number;
  timestamp: string;
}

export function ScanItem({
  image,
  status,
  pest,
  confidence,
  timestamp,
}: ScanItemProps) {
  return (
    <div className="group relative flex items-center gap-4 p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/5 hover:border-[#00ff9d]/30 transition-all duration-300 overflow-hidden">
      {/* Background glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#00ff9d]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

      <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/10 group-hover:border-[#00ff9d]/50 transition-colors">
        <ImageWithFallback
          src={image}
          alt="Tomato leaf scan"
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
        />
        {/* Scanning line effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00ff9d]/20 to-transparent h-1 w-full -top-full group-hover:top-full transition-all duration-1000"></div>
      </div>

      <div className="flex-1 relative z-10">
        <div className="flex items-center justify-between mb-1.5">
          <span
            className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tighter italic ${
              status === "healthy"
                ? "bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/20"
                : "bg-[#ff003c]/10 text-[#ff003c] border border-[#ff003c]/20"
            }`}
          >
            {status === "healthy" ? "CLEAN SAMPLE" : "PATHOGEN DETECTED"}
          </span>
          <span className="text-[10px] font-mono text-gray-500 tracking-tighter">
            {timestamp}
          </span>
        </div>

        {pest ? (
          <p className="text-sm font-bold text-white uppercase italic tracking-tighter group-hover:text-[#00ff9d] transition-colors">
            {pest}
          </p>
        ) : (
          <p className="text-sm font-bold text-gray-400 uppercase italic tracking-tighter">
            Healthy Specimen
          </p>
        )}

        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${status === "healthy" ? "bg-[#00ff9d]" : "bg-[#ff003c]"} opacity-50`}
              style={{ width: `${confidence}%` }}
            ></div>
          </div>
          <span className="text-[9px] font-mono text-gray-600 uppercase italic font-bold">
            {confidence}% CONF
          </span>
        </div>
      </div>
    </div>
  );
}
