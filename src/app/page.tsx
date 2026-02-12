"use client";

import { Scan, AlertTriangle, TrendingUp, Upload } from "lucide-react";
import { StatCard } from "@/presentation/components/StatCard";
import { ScanItem } from "@/presentation/components/ScanItem";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useRouter } from "next/navigation";

const chartData = [
  { month: "Jan", whitefly: 12, aphids: 8, mites: 5 },
  { month: "Feb", whitefly: 15, aphids: 12, mites: 7 },
  { month: "Mar", whitefly: 18, aphids: 15, mites: 10 },
  { month: "Apr", whitefly: 22, aphids: 18, mites: 12 },
  { month: "May", whitefly: 28, aphids: 22, mites: 15 },
  { month: "Jun", whitefly: 25, aphids: 20, mites: 13 },
  { month: "Jul", whitefly: 20, aphids: 16, mites: 10 },
];

const recentScans = [
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
];

export default function Dashboard() {
  const router = useRouter();

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Monitor your crop health and pest detection analytics</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Scans"
          value="1,284"
          icon={Scan}
          trend="+12% from last month"
          trendUp={true}
          color="blue"
        />
        <StatCard
          title="Infection Rate"
          value="18.5%"
          icon={AlertTriangle}
          trend="+2.3% from last week"
          trendUp={false}
          color="red"
        />
        <StatCard
          title="Active Alerts"
          value="7"
          icon={TrendingUp}
          trend="3 require attention"
          trendUp={false}
          color="red"
        />
      </div>

      {/* Upload Button */}
      <div className="mb-8">
        <button
          onClick={() => router.push("/analysis")}
          className="w-full bg-gradient-to-r from-[#FF6347] to-[#32CD32] text-white px-6 py-4 rounded-xl font-medium flex items-center justify-center gap-3 hover:opacity-90 transition-opacity shadow-lg cursor-pointer"
        >
          <Upload className="w-5 h-5" />
          Upload New Scan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Pest Detection Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="whitefly"
                stroke="#FF6347"
                strokeWidth={2}
                dot={{ fill: "#FF6347" }}
                name="Whitefly"
              />
              <Line
                type="monotone"
                dataKey="aphids"
                stroke="#FFA500"
                strokeWidth={2}
                dot={{ fill: "#FFA500" }}
                name="Aphids"
              />
              <Line
                type="monotone"
                dataKey="mites"
                stroke="#32CD32"
                strokeWidth={2}
                dot={{ fill: "#32CD32" }}
                name="Spider Mites"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Scans</h2>
          <div className="space-y-4">
            {recentScans.map((scan) => (
              <ScanItem key={scan.id} {...scan} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
