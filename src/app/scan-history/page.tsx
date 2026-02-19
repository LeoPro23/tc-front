"use client";

import { useState } from "react";
import { ScanItem } from "@/presentation/components/ScanItem";
import { Search, Calendar } from "lucide-react";

const allScans = [
  {
    id: "1",
    image:
      "https://images.unsplash.com/photo-1762608292626-a384d1cc401f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b21hdG8lMjBsZWFmJTIwZGlzZWFzZSUyMGNsb3NldXB8ZW58MXx8fHwxNzcwODY4NTcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    status: "infected" as const,
    pest: "Whitefly Infestation",
    confidence: 98,
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    image:
      "https://images.unsplash.com/photo-1768113802430-dcb7c874407f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwdG9tYXRvJTIwcGxhbnQlMjBsZWFmfGVufDF8fHx8MTc3MDg2ODU3Mnww&ixlib=rb-4.1.0&q=80&w=1080",
    status: "healthy" as const,
    confidence: 95,
    timestamp: "5 hours ago",
  },
  {
    id: "3",
    image:
      "https://images.unsplash.com/photo-1720487222334-f91d9d74c852?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b21hdG8lMjBncmVlbmhvdXNlJTIwYWdyaWN1bHR1cmV8ZW58MXx8fHwxNzcwODY4NTcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    status: "healthy" as const,
    confidence: 92,
    timestamp: "1 day ago",
  },
  {
    id: "4",
    image:
      "https://images.unsplash.com/photo-1762608292626-a384d1cc401f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b21hdG8lMjBsZWFmJTIwZGlzZWFzZSUyMGNsb3NldXB8ZW58MXx8fHwxNzcwODY4NTcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    status: "infected" as const,
    pest: "Spider Mites",
    confidence: 87,
    timestamp: "2 days ago",
  },
  {
    id: "5",
    image:
      "https://images.unsplash.com/photo-1768113802430-dcb7c874407f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwdG9tYXRvJTIwcGxhbnQlMjBsZWFmfGVufDF8fHx8MTc3MDg2ODU3Mnww&ixlib=rb-4.1.0&q=80&w=1080",
    status: "healthy" as const,
    confidence: 96,
    timestamp: "3 days ago",
  },
  {
    id: "6",
    image:
      "https://images.unsplash.com/photo-1762608292626-a384d1cc401f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b21hdG8lMjBsZWFmJTIwZGlzZWFzZSUyMGNsb3NldXB8ZW58MXx8fHwxNzcwODY4NTcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    status: "infected" as const,
    pest: "Aphids",
    confidence: 91,
    timestamp: "4 days ago",
  },
  {
    id: "7",
    image:
      "https://images.unsplash.com/photo-1768113802430-dcb7c874407f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwdG9tYXRvJTIwcGxhbnQlMjBsZWFmfGVufDF8fHx8MTc3MDg2ODU3Mnww&ixlib=rb-4.1.0&q=80&w=1080",
    status: "healthy" as const,
    confidence: 94,
    timestamp: "5 days ago",
  },
  {
    id: "8",
    image:
      "https://images.unsplash.com/photo-1762608292626-a384d1cc401f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b21hdG8lMjBsZWFmJTIwZGlzZWFzZSUyMGNsb3NldXB8ZW58MXx8fHwxNzcwODY4NTcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    status: "infected" as const,
    pest: "Early Blight",
    confidence: 89,
    timestamp: "1 week ago",
  },
];

import { motion } from "framer-motion";

export default function ScanHistoryPage() {
  const [filter, setFilter] = useState<"all" | "healthy" | "infected">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredScans = allScans.filter((scan) => {
    const matchesFilter = filter === "all" || scan.status === filter;
    const matchesSearch =
      searchQuery === "" ||
      scan.pest?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scan.status.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-white p-8 font-sans transition-colors duration-300">
      {/* Header */}
      <div className="mb-12 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-2">
            SCAN<span className="text-emerald-600 dark:text-[#00ff9d]">ARCHIVE</span>
          </h1>
          <p className="text-[10px] text-gray-500 font-mono tracking-[0.2em] uppercase">
            Historical Pathogen Database // Secured
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4 dark:backdrop-blur-xl shadow-sm dark:shadow-none">
          <div className="text-right">
            <p className="text-[9px] text-gray-500 font-mono uppercase">
              Total Records
            </p>
            <p className="text-xl font-black italic text-emerald-600 dark:text-[#00ff9d] leading-none">
              {allScans.length}
            </p>
          </div>
          <div className="w-[1px] h-8 bg-gray-200 dark:bg-white/10"></div>
          <div className="text-right">
            <p className="text-[9px] text-gray-500 font-mono uppercase">
              Filtered
            </p>
            <p className="text-xl font-black italic leading-none">
              {filteredScans.length}
            </p>
          </div>
        </div>
      </div>

      {/* Filters & Tools */}
      <div className="mb-8 max-w-7xl mx-auto flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-emerald-600 dark:group-focus-within:text-[#00ff9d] transition-colors" />
          <input
            type="text"
            placeholder="SEARCH RECORDS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-2xl focus:outline-none focus:ring-1 focus:ring-emerald-500/50 dark:focus:ring-[#00ff9d]/50 focus:bg-white dark:focus:bg-white/10 transition-all font-mono text-xs uppercase tracking-widest placeholder:text-gray-400 dark:placeholder:text-gray-700 text-gray-900 dark:text-white shadow-sm dark:shadow-none"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 p-1.5 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/5 h-fit shadow-sm dark:shadow-none">
          {[
            { id: "all", label: "ALL UNITS", color: "text-gray-900 dark:text-white" },
            { id: "healthy", label: "HEALTHY", color: "text-emerald-600 dark:text-[#00ff9d]" },
            { id: "infected", label: "INFECTED", color: "text-[#ff003c]" },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() =>
                setFilter(btn.id as "all" | "healthy" | "infected")
              }
              className={`px-6 py-2.5 rounded-xl font-black italic text-[10px] tracking-[0.1em] transition-all ${filter === btn.id
                  ? "bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white shadow-sm dark:shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-gray-200 dark:border-white/10"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                } ${filter === btn.id ? btn.color : ""}`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Range Filter */}
        <button className="px-6 py-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 text-[10px] font-black italic tracking-widest text-emerald-600 dark:text-[#00ff9d] rounded-2xl hover:bg-emerald-50 dark:hover:bg-[#00ff9d]/10 transition-all flex items-center gap-3 shadow-sm dark:shadow-none">
          <Calendar className="w-4 h-4" />
          TIME RANGE // SELECT
        </button>
      </div>

      {/* Scans Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScans.map((scan, idx) => (
            <motion.div
              key={scan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <ScanItem {...scan} />
            </motion.div>
          ))}
        </div>

        {filteredScans.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            className="text-center py-24"
          >
            <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-200 dark:border-white/5">
              <Search className="w-8 h-8 text-gray-400 dark:text-gray-700" />
            </div>
            <p className="text-gray-500 dark:text-gray-600 font-mono text-xs uppercase tracking-[0.3em]">
              No data matching parameters found.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
