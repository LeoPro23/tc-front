"use client";

import { useState, useEffect } from "react";
import { ScanItem } from "@/presentation/components/ScanItem";
import { Search, Calendar, ChevronDown } from "lucide-react";
import { managementApi } from "@/lib/api/management.service";
import type { Campaign, FieldCampaign, AnalysisFieldCampaignHistory } from "@/lib/api/management.types";
import { motion } from "framer-motion";

export default function ScanHistoryPage() {
  const [filter, setFilter] = useState<"all" | "healthy" | "infected">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Data States
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");
  const [enrolledFields, setEnrolledFields] = useState<FieldCampaign[]>([]);

  // Array of selected field IDs for multi-select
  const [selectedFieldIds, setSelectedFieldIds] = useState<string[]>([]);
  const [isFieldDropdownOpen, setIsFieldDropdownOpen] = useState(false);

  // Date Range
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // History State
  const [historyItems, setHistoryItems] = useState<AnalysisFieldCampaignHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initial Data Load (Campaigns)
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const fetchedCampaigns = await managementApi.getCampaigns();
        if (active) {
          setCampaigns(fetchedCampaigns);
          const activeCampaign = fetchedCampaigns.find(c => c.isActive);
          if (activeCampaign) {
            setSelectedCampaignId(activeCampaign.id);
          }
        }
      } catch (err) {
        console.error("Error cargando campañas", err);
      }
    })();
    return () => { active = false; };
  }, []);

  // Fetch Fields when Campaign Changes
  useEffect(() => {
    let active = true;
    if (selectedCampaignId) {
      managementApi.getEnrolledFields(selectedCampaignId)
        .then(res => {
          if (active) {
            setEnrolledFields(res);
            // reset selected fields when campaign changes
            setSelectedFieldIds([]);
          }
        })
        .catch(err => console.error("Error obteniendo enrolled fields", err));
    } else {
      setEnrolledFields([]);
      setSelectedFieldIds([]);
    }
    return () => { active = false; };
  }, [selectedCampaignId]);

  // Fetch History
  useEffect(() => {
    let active = true;
    const fetchHistory = async () => {
      if (!selectedCampaignId) {
        setHistoryItems([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const params: any = { campaignId: selectedCampaignId };

        if (filter !== "all") {
          params.isInfected = filter === "infected";
        }
        if (selectedFieldIds.length > 0) {
          params.fieldIds = selectedFieldIds;
        }
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;

        const res = await managementApi.getScanHistory(params);

        // Client-side search for free text since endpoint doesn't natively do text search yet
        let finalData = res;
        if (searchQuery.trim()) {
          const lowerQ = searchQuery.toLowerCase();
          finalData = finalData.filter(h =>
            h.primaryTargetPest?.toLowerCase().includes(lowerQ) ||
            h.recommendedProduct?.toLowerCase().includes(lowerQ) ||
            h.generalSummary?.toLowerCase().includes(lowerQ) ||
            h.fieldCampaign.field.name.toLowerCase().includes(lowerQ)
          );
        }

        if (active) setHistoryItems(finalData);
      } catch (err) {
        console.error("Error cargando historial", err);
        if (active) setHistoryItems([]);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    // Debounce to prevent slamming API on every keystroke
    const debounceTimeout = setTimeout(() => {
      fetchHistory();
    }, 300);

    return () => {
      active = false;
      clearTimeout(debounceTimeout);
    };
  }, [selectedCampaignId, filter, selectedFieldIds, startDate, endDate, searchQuery]);


  const toggleFieldSelect = (fieldId: string) => {
    setSelectedFieldIds(prev =>
      prev.includes(fieldId) ? prev.filter(id => id !== fieldId) : [...prev, fieldId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-white p-6 md:p-8 font-sans transition-colors duration-300">
      {/* Header */}
      <div className="mb-12 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-2">
            ESCANEO<span className="text-emerald-600 dark:text-[#00ff9d]">ARCHIVO</span>
          </h1>
          <p className="text-[10px] text-gray-500 font-mono tracking-[0.2em] uppercase">
            Base de Datos Histórica de Patógenos // Asegurada
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <select
            className="px-4 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-bold shadow-sm dark:shadow-none min-w-[200px]"
            value={selectedCampaignId}
            onChange={e => setSelectedCampaignId(e.target.value)}
          >
            <option value="" disabled>-- Seleccionar Campaña --</option>
            {campaigns.map(c => (
              <option key={c.id} value={c.id}>{c.isActive ? '✅ ' : ''}{c.startDate} a {c.endDate}</option>
            ))}
          </select>

          <div className="flex items-center gap-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4 dark:backdrop-blur-xl shadow-sm dark:shadow-none">
            <div className="text-right">
              <p className="text-[9px] text-gray-500 font-mono uppercase">
                Filtrados
              </p>
              <p className="text-xl font-black italic text-emerald-600 dark:text-[#00ff9d] leading-none">
                {isLoading ? "..." : historyItems.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Tools */}
      <div className="mb-8 max-w-7xl mx-auto flex flex-col xl:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 min-w-[250px] relative group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-emerald-600 dark:group-focus-within:text-[#00ff9d] transition-colors" />
          <input
            type="text"
            placeholder="BUSCAR REGISTROS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 h-[54px] bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-2xl focus:outline-none focus:ring-1 focus:ring-emerald-500/50 dark:focus:ring-[#00ff9d]/50 focus:bg-white dark:focus:bg-white/10 transition-all font-mono text-xs uppercase tracking-widest placeholder:text-gray-400 dark:placeholder:text-gray-700 text-gray-900 dark:text-white shadow-sm dark:shadow-none"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 p-1.5 h-[54px] bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none whitespace-nowrap overflow-x-auto custom-scrollbar">
          {[
            { id: "all", label: "TODOS", color: "text-gray-900 dark:text-white" },
            { id: "healthy", label: "SALUDABLE", color: "text-emerald-600 dark:text-[#00ff9d]" },
            { id: "infected", label: "INFECTADO", color: "text-[#ff003c]" },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.id as "all" | "healthy" | "infected")}
              className={`px-6 py-2 rounded-xl font-black italic text-[10px] tracking-[0.1em] transition-all h-full ${filter === btn.id
                ? "bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white shadow-sm dark:shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-gray-200 dark:border-white/10"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                } ${filter === btn.id ? btn.color : ""}`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Lotes Picker (Custom Multi-select dropdown) */}
        <div className="relative">
          <button
            onClick={() => setIsFieldDropdownOpen(!isFieldDropdownOpen)}
            className="px-6 py-4 h-[54px] whitespace-nowrap bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 text-[10px] font-black italic tracking-widest text-emerald-600 dark:text-[#00ff9d] rounded-2xl hover:bg-emerald-50 dark:hover:bg-[#00ff9d]/10 transition-all flex items-center justify-between gap-3 shadow-sm dark:shadow-none min-w-[200px]"
          >
            LOTES SELECCIONADOS ({selectedFieldIds.length === 0 ? 'TODOS' : selectedFieldIds.length})
            <ChevronDown className="w-4 h-4" />
          </button>

          {isFieldDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-full z-50 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl max-h-60 overflow-y-auto">
              <div className="p-2 flex flex-col gap-1">
                {enrolledFields.length === 0 && <p className="text-xs text-gray-500 p-2 text-center">Sin lotes</p>}
                {enrolledFields.map(ef => (
                  <label key={ef.field.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFieldIds.includes(ef.field.id)}
                      onChange={() => toggleFieldSelect(ef.field.id)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 bg-transparent border-gray-300 dark:border-gray-700"
                    />
                    <span className="text-sm">{ef.field.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Range Filter */}
        <div className="flex h-[54px] items-center gap-2 bg-white dark:bg-white/5 p-1 border border-gray-200 dark:border-white/5 rounded-2xl shadow-sm dark:shadow-none px-2 min-w-fit flex-shrink-0">
          <Calendar className="w-4 h-4 ml-2 text-emerald-600 dark:text-[#00ff9d]" />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-transparent border-none text-xs outline-none uppercase font-mono tracking-widest text-gray-700 dark:text-gray-300 focus:ring-0 [&::-webkit-calendar-picker-indicator]:dark:invert"
          />
          <span className="text-gray-400 font-bold">-</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-transparent border-none text-xs outline-none uppercase font-mono tracking-widest text-gray-700 dark:text-gray-300 focus:ring-0 [&::-webkit-calendar-picker-indicator]:dark:invert"
          />
        </div>
      </div>

      {/* Scans Grid */}
      <div className="max-w-7xl mx-auto relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl min-h-[300px]">
            <p className="font-mono text-emerald-600 dark:text-[#00ff9d] animate-pulse uppercase text-sm tracking-widest font-bold">Cargando base de batos neural...</p>
          </div>
        )}

        {/* Grid de Análisis por Lote */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {historyItems.map((item, idx) => {
            const isHealthy = !item.isInfected;

            // Extraer la primera imagen miniatura (si existe) para representación visual del lote analizado
            const thumbnail = item.attachedImages && item.attachedImages.length > 0
              ? item.attachedImages[0].url
              : "https://images.unsplash.com/photo-1720487222334-f91d9d74c852?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b21hdG8lMjBncmVlbmhvdXNlJTIwYWdyaWN1bHR1cmV8ZW58MXx8fHwxNzcwODY4NTcxfDA&ixlib=rb-4.1.0&q=80&w=1080";

            // Mostrar la Plaga si está infectado, sino el nombre de la recomendación general o Lote
            const displayTitle = item.isInfected && item.primaryTargetPest
              ? `${item.primaryTargetPest} (${item.fieldCampaign.field.name})`
              : `LOTE: ${item.fieldCampaign.field.name}`;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (idx * 0.05) }}
              >
                <ScanItem
                  id={item.id}
                  image={thumbnail}
                  status={isHealthy ? "healthy" : "infected"}
                  pest={displayTitle}
                  confidence={item.maxConfidence ? Math.round(item.maxConfidence * 100) : 0}
                  timestamp={new Date(item.date).toLocaleDateString() + ' ' + new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                />
              </motion.div>
            );
          })}
        </div>

        {!isLoading && historyItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            className="text-center py-24"
          >
            <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-200 dark:border-white/5">
              <Search className="w-8 h-8 text-gray-400 dark:text-gray-700" />
            </div>
            <p className="text-gray-500 dark:text-gray-600 font-mono text-xs uppercase tracking-[0.3em]">
              No se encontraron datos con los parámetros indicados.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

