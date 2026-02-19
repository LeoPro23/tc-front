"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, History, FileText, Settings, Leaf, ScanLine } from "lucide-react";
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
        <div className="flex h-screen bg-white text-gray-900">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
                {/* Logo */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#FF6347] to-[#32CD32] rounded-lg flex items-center justify-center">
                            <Leaf className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-xl text-gray-900">TomatoCode</h1>
                            <p className="text-xs text-gray-500">AgriTech AI Platform</p>
                        </div>
                    </div>
                </div>

                {/* Scan CTA Button */}
                <div className="px-4 pt-4">
                    <Link
                        href="/scan"
                        className="group relative flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-lg active:scale-95"
                        style={{
                            background: "linear-gradient(135deg, #FF6347 0%, #FF4500 50%, #32CD32 100%)",
                            boxShadow: "0 4px 15px rgba(255, 99, 71, 0.4)",
                        }}
                    >
                        <span
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{
                                background: "linear-gradient(135deg, #FF4500 0%, #FF6347 50%, #228B22 100%)",
                            }}
                        />
                        <ScanLine className="w-5 h-5 relative z-10 group-hover:animate-pulse" />
                        <span className="relative z-10 tracking-wide">Escanear Planta</span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                                    isActive
                                        ? "bg-[#FF6347] text-white"
                                        : "text-gray-700 hover:bg-gray-100"
                                )}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-3 px-4 py-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">John Farmer</p>
                            <p className="text-xs text-gray-500">Farm Admin</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-white">
                {children}
            </main>
        </div>
    );
}
