"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  History,
  Settings,
  Leaf,
  ScanLine,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getUser, removeToken } from "@/lib/auth-helpers";
import { User } from "@/domain/auth/user";

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = getUser<User>();
    if (!currentUser) {
      router.replace("/login");
    } else {
      setUser(currentUser);
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-t-2 border-[#00ff9d] rounded-full animate-spin" />
          <p className="text-[#00ff9d] font-mono text-xs tracking-widest animate-pulse">
            SISTEMA NEURAL CARGANDO...
          </p>
        </div>
      </div>
    );
  }

  function handleLogout() {
    removeToken();
    router.push("/login");
  }

  const navItems = [
    { href: "/", label: "Panel", icon: LayoutDashboard },
    { href: "/scan-history", label: "Historial", icon: History },
    { href: "/settings", label: "Configuracion", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <aside className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-colors duration-300">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FF6347] to-[#32CD32] rounded-lg flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900 dark:text-white">TomatoCode</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Plataforma IA Agricola</p>
            </div>
          </div>
        </div>

        <div className="px-4 pt-4">
          <Link
            href="/analysis"
            className="group relative flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-lg active:scale-95"
            style={{
              background:
                "linear-gradient(135deg, #FF6347 0%, #FF4500 50%, #32CD32 100%)",
              boxShadow: "0 4px 15px rgba(255, 99, 71, 0.4)",
            }}
          >
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background:
                  "linear-gradient(135deg, #FF4500 0%, #FF6347 50%, #228B22 100%)",
              }}
            />
            <ScanLine className="w-5 h-5 relative z-10 group-hover:animate-pulse" />
            <span className="relative z-10 tracking-wide">Ir a Analisis</span>
          </Link>
        </div>

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
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#00ff9d]/30 to-emerald-600/30 border border-[#00ff9d]/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-[#00ff9d]">
                {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.name ?? "Usuario"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email ?? "-"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesion</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-white dark:bg-gray-950 transition-colors duration-300">
        {children}
      </main>
    </div>
  );
}
