import type { ImageAnalysisEntry } from "./types";

interface ImageBatchTabsProps {
  imageEntries: ImageAnalysisEntry[];
  selectedImageIndex: number;
  onSelectImage: (index: number) => void;
}

export function ImageBatchTabs({
  imageEntries,
  selectedImageIndex,
  onSelectImage,
}: ImageBatchTabsProps) {
  if (imageEntries.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-black/40 dark:backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/5 px-3 py-3 shadow-sm dark:shadow-none">
      <div className="flex items-center justify-between gap-3 mb-2">
        <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400">
          Lote de Imagenes
        </p>
        <p className="text-[10px] font-mono uppercase text-gray-500 dark:text-gray-500">
          {selectedImageIndex + 1}/{imageEntries.length}
        </p>
      </div>
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {imageEntries.map((entry, index) => {
          const active = index === selectedImageIndex;
          const rejected = entry.verified === false;
          return (
            <button
              key={entry.id}
              onClick={() => onSelectImage(index)}
              className={`px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                active
                  ? rejected
                    ? "bg-amber-500/20 border-amber-500/60 text-amber-700 dark:text-amber-300"
                    : "bg-emerald-500/20 border-emerald-500/60 text-emerald-700 dark:text-[#00ff9d]"
                  : "bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:border-emerald-400/50"
              }`}
            >
              {index + 1}. {entry.file.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
