"use client";

import { useState } from "react";
import { ScanItem } from "@/presentation/components/ScanItem";
import { Search, Filter, Calendar } from "lucide-react";

const allScans = [
    {
        id: "1",
        image: "https://images.unsplash.com/photo-1762608292626-a384d1cc401f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b21hdG8lMjBsZWFmJTIwZGlzZWFzZSUyMGNsb3NldXB8ZW58MXx8fHwxNzcwODY4NTcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
        status: "infected" as const,
        pest: "Whitefly Infestation",
        confidence: 98,
        timestamp: "2 hours ago",
    },
    {
        id: "2",
        image: "https://images.unsplash.com/photo-1768113802430-dcb7c874407f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwdG9tYXRvJTIwcGxhbnQlMjBsZWFmfGVufDF8fHx8MTc3MDg2ODU3Mnww&ixlib=rb-4.1.0&q=80&w=1080",
        status: "healthy" as const,
        confidence: 95,
        timestamp: "5 hours ago",
    },
    {
        id: "3",
        image: "https://images.unsplash.com/photo-1720487222334-f91d9d74c852?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b21hdG8lMjBncmVlbmhvdXNlJTIwYWdyaWN1bHR1cmV8ZW58MXx8fHwxNzcwODY4NTcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
        status: "healthy" as const,
        confidence: 92,
        timestamp: "1 day ago",
    },
    {
        id: "4",
        image: "https://images.unsplash.com/photo-1762608292626-a384d1cc401f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b21hdG8lMjBsZWFmJTIwZGlzZWFzZSUyMGNsb3NldXB8ZW58MXx8fHwxNzcwODY4NTcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
        status: "infected" as const,
        pest: "Spider Mites",
        confidence: 87,
        timestamp: "2 days ago",
    },
    {
        id: "5",
        image: "https://images.unsplash.com/photo-1768113802430-dcb7c874407f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwdG9tYXRvJTIwcGxhbnQlMjBsZWFmfGVufDF8fHx8MTc3MDg2ODU3Mnww&ixlib=rb-4.1.0&q=80&w=1080",
        status: "healthy" as const,
        confidence: 96,
        timestamp: "3 days ago",
    },
    {
        id: "6",
        image: "https://images.unsplash.com/photo-1762608292626-a384d1cc401f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b21hdG8lMjBsZWFmJTIwZGlzZWFzZSUyMGNsb3NldXB8ZW58MXx8fHwxNzcwODY4NTcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
        status: "infected" as const,
        pest: "Aphids",
        confidence: 91,
        timestamp: "4 days ago",
    },
    {
        id: "7",
        image: "https://images.unsplash.com/photo-1768113802430-dcb7c874407f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwdG9tYXRvJTIwcGxhbnQlMjBsZWFmfGVufDF8fHx8MTc3MDg2ODU3Mnww&ixlib=rb-4.1.0&q=80&w=1080",
        status: "healthy" as const,
        confidence: 94,
        timestamp: "5 days ago",
    },
    {
        id: "8",
        image: "https://images.unsplash.com/photo-1762608292626-a384d1cc401f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b21hdG8lMjBsZWFmJTIwZGlzZWFzZSUyMGNsb3NldXB8ZW58MXx8fHwxNzcwODY4NTcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
        status: "infected" as const,
        pest: "Early Blight",
        confidence: 89,
        timestamp: "1 week ago",
    },
];

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
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Scan History</h1>
                <p className="text-gray-600">View and manage all your leaf scan records</p>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search scans..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6347] focus:border-transparent"
                    />
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter("all")}
                        className={`px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${filter === "all"
                                ? "bg-[#FF6347] text-white"
                                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        <Filter className="w-4 h-4" />
                        All
                    </button>
                    <button
                        onClick={() => setFilter("healthy")}
                        className={`px-4 py-3 rounded-lg font-medium transition-colors ${filter === "healthy"
                                ? "bg-[#32CD32] text-white"
                                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        Healthy
                    </button>
                    <button
                        onClick={() => setFilter("infected")}
                        className={`px-4 py-3 rounded-lg font-medium transition-colors ${filter === "infected"
                                ? "bg-[#FF6347] text-white"
                                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        Infected
                    </button>
                </div>

                {/* Date Filter */}
                <button className="px-4 py-3 bg-gray-50 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date Range
                </button>
            </div>

            {/* Results Count */}
            <div className="mb-4">
                <p className="text-sm text-gray-600">
                    Showing {filteredScans.length} of {allScans.length} scans
                </p>
            </div>

            {/* Scans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredScans.map((scan) => (
                    <ScanItem key={scan.id} {...scan} />
                ))}
            </div>

            {filteredScans.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No scans found matching your criteria</p>
                </div>
            )}
        </div>
    );
}
