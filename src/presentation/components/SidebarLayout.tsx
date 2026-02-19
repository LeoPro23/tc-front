"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  History,
  FileText,
  Settings,
  Leaf,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/scan-history", label: "Scan History", icon: History },
    { href: "/analysis", label: "Analysis", icon: FileText },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white selection:bg-[#00ff9d]/30">
      {/* Sidebar */}
      <aside className="w-64 bg-black/40 backdrop-blur-xl border-r border-white/5 flex flex-col relative overflow-hidden group">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#00ff9d]/5 rounded-full blur-[80px] pointer-events-none"></div>

        {/* Logo */}
        <div className="p-6 border-b border-white/5 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 shadow-[0_0_15px_rgba(0,255,157,0.1)]">
              <Leaf className="w-6 h-6 text-[#00ff9d]" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tighter text-white uppercase italic">
                TOMATO<span className="text-[#00ff9d]">CODE</span>
              </h1>
              <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">
                AI SURVEILLANCE
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 relative z-10">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group/item",
                  isActive
                    ? "bg-emerald-500/10 text-[#00ff9d] border border-emerald-500/20 shadow-[0_0_20px_rgba(0,255,157,0.1)]"
                    : "text-gray-400 hover:bg-white/5 hover:text-white",
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 transition-colors",
                    isActive
                      ? "text-[#00ff9d]"
                      : "text-gray-500 group-hover/item:text-white",
                  )}
                />
                <span className="font-medium text-sm tracking-tight">
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 w-1 h-6 bg-[#00ff9d] rounded-r-full shadow-[0_0_10px_#00ff9d]"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-black/20 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center">
              <div className="w-2 h-2 bg-[#00ff9d] rounded-full animate-pulse shadow-[0_0_8px_#00ff9d]"></div>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold text-white truncate uppercase tracking-tighter">
                AGRI-OPERATOR X
              </p>
              <p className="text-[10px] text-emerald-400/60 font-mono truncate">
                SYSTEM ACTIVE
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-[#0a0a0a]">{children}</main>
    </div>
  );
}
