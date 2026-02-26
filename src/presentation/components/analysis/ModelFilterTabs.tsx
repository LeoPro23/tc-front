interface ModelFilterTabsProps {
  modelNames: string[];
  selectedModels: string[];
  activeFilterLabel: string;
  onSelectAll: () => void;
  onToggleModel: (model: string) => void;
}

export function ModelFilterTabs({
  modelNames,
  selectedModels,
  activeFilterLabel,
  onSelectAll,
  onToggleModel,
}: ModelFilterTabsProps) {
  return (
    <div className="bg-white dark:bg-black/40 dark:backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/5 px-3 py-3 shadow-sm dark:shadow-none">
      <div className="flex items-center justify-between gap-3 mb-2">
        <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400">
          Filtro de Modelos
        </p>
        <p className="text-[10px] font-mono uppercase text-gray-500 dark:text-gray-500 truncate max-w-[45%] text-right">
          Activo: {activeFilterLabel}
        </p>
      </div>
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={onSelectAll}
          className={`px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
            selectedModels.length === 0
              ? "bg-emerald-500/20 border-emerald-500/60 text-emerald-700 dark:text-[#00ff9d]"
              : "bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:border-emerald-400/50"
          }`}
        >
          Todos
        </button>
        {modelNames.map((model) => {
          const active = selectedModels.includes(model);
          return (
            <button
              key={model}
              onClick={() => onToggleModel(model)}
              className={`px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                active
                  ? "bg-[#ff003c]/20 border-[#ff003c]/60 text-[#ff003c]"
                  : "bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:border-[#ff003c]/40"
              }`}
            >
              {model}
            </button>
          );
        })}
      </div>
    </div>
  );
}
