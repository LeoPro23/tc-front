import { ImageWithFallback } from "../components/figma/ImageWithFallback";

interface ScanItemProps {
  id: string;
  image: string;
  status: "healthy" | "infected";
  pest?: string;
  confidence: number;
  timestamp: string;
}

export function ScanItem({ image, status, pest, confidence, timestamp }: ScanItemProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
      <ImageWithFallback
        src={image}
        alt="Tomato leaf scan"
        className="w-16 h-16 rounded-lg object-cover"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              status === "healthy"
                ? "bg-[#32CD32] text-white"
                : "bg-[#FF6347] text-white"
            }`}
          >
            {status === "healthy" ? "Healthy" : "Infected"}
          </span>
          <span className="text-sm text-gray-600">{confidence}% confidence</span>
        </div>
        {pest && <p className="text-sm text-gray-900 font-medium">{pest}</p>}
        <p className="text-xs text-gray-500">{timestamp}</p>
      </div>
    </div>
  );
}
