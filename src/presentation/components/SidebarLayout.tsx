"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  ScanLine,
  History,
  LogOut,
  WifiOff,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getUser, removeToken } from "@/lib/auth-helpers";
import { User } from "@/domain/auth/user";
import { URL_BACKEND } from "@/shared/config/backend-url";

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [offlineInfo, setOfflineInfo] = useState<{
    offline: boolean;
    services: Record<string, boolean>;
  }>({ offline: false, services: {} });
  const pollRef = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    const currentUser = getUser<User>();
    if (!currentUser) {
      router.replace("/login");
    } else {
      setUser(currentUser);
      setIsLoading(false);
    }
  }, [router]);

  const checkConnectivity = useCallback(async () => {
    if (!navigator.onLine) {
      setOfflineInfo({ offline: true, services: {} });
      return;
    }
    try {
      const res = await fetch(`${URL_BACKEND}/connectivity`, {
        signal: AbortSignal.timeout(5000),
      });
      const data = await res.json();
      setOfflineInfo({
        offline: !data.online,
        services: data.services ?? {},
      });
    } catch {
      setOfflineInfo({ offline: true, services: {} });
    }
  }, []);

  useEffect(() => {
    checkConnectivity();
    pollRef.current = setInterval(checkConnectivity, 30_000);

    const goOnline = () => checkConnectivity();
    const goOffline = () =>
      setOfflineInfo({ offline: true, services: {} });

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      clearInterval(pollRef.current);
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, [checkConnectivity]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-t-2 border-emerald-500 dark:border-[#00ff9d] rounded-full animate-spin" />
          <p className="text-emerald-600 dark:text-[#00ff9d] font-mono text-xs tracking-widest animate-pulse">
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
    { href: "/analysis", label: "Escanear", icon: ScanLine, mobileOnly: true },
    { href: "/scan-history", label: "Historial", icon: History },
    { href: "/settings", label: "Configuracion", icon: Settings },
  ];

  return (
    <div className="fixed inset-0 flex flex-col md:flex-row bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-gray-100 transition-colors duration-300">
      <aside className="w-full md:w-64 shrink-0 bg-white dark:bg-[#0d0d0d] border-t md:border-t-0 md:border-r border-slate-200 dark:border-white/5 flex flex-row md:flex-col transition-colors duration-300 order-last md:order-first z-50">
        <div className="hidden md:block p-6 border-b border-slate-200 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#00ff9d]/10 border border-[#00ff9d]/30 rounded-lg flex items-center justify-center p-1.5">
              <Image
                src="/images/logo-bg-transparent.png"
                alt="PlagaCode Logo"
                width={28}
                height={28}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900 dark:text-white">PlagaCode</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Plataforma IA Agricola</p>
            </div>
          </div>
        </div>

        <div className="hidden md:block px-4 pt-4">
          <Link
            href="/analysis"
            className="group relative flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl font-bold uppercase tracking-widest text-emerald-600 dark:text-[#00ff9d] overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] dark:hover:shadow-[0_0_15px_rgba(0,255,157,0.2)] active:scale-95 bg-white dark:bg-[#111] border border-emerald-500/20 dark:border-[#00ff9d]/30 hover:border-emerald-500 dark:hover:border-[#00ff9d]"
          >
            <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-emerald-500/10 to-emerald-400/10 dark:from-[#00ff9d]/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-[2px]" />
            <ScanLine className="w-5 h-5 relative z-10 group-hover:animate-pulse" />
            <span className="relative z-10 text-xs text-center leading-tight">IR A ESCANEO<br />NEURAL</span>
            <motion.span
              animate={{ left: ["-100%", "200%"] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "linear",
                repeatDelay: 1.5,
              }}
              className="absolute left-0 top-0 h-full w-1/2 skew-x-12 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent dark:via-[#00ff9d]/10"
            />
          </Link>
        </div>

        <nav className="flex-1 flex md:flex-col p-2 md:p-4 gap-1 md:space-y-1 justify-around md:justify-start">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-center md:justify-start gap-1 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-all duration-300 flex-1 md:flex-none flex-col md:flex-row",
                  item.mobileOnly ? "flex md:hidden" : "flex",
                  isActive
                    ? "text-emerald-600 dark:text-[#00ff9d] bg-emerald-500/10 dark:bg-[#00ff9d]/10 md:border md:border-emerald-500/20 md:dark:border-[#00ff9d]/20 md:shadow-[0_0_10px_rgba(16,185,129,0.05)] md:dark:shadow-[0_0_10px_rgba(0,255,157,0.05)]"
                    : "text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-[#00ff9d] hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent",
                )}
              >
                <item.icon className="w-5 h-5 md:w-5 md:h-5" />
                <span className="font-medium text-[10px] md:text-sm tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block p-4 border-t border-slate-200 dark:border-white/5">
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <div className="w-8 h-8 bg-[#00ff9d]/10 border border-[#00ff9d]/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-emerald-600 dark:text-[#00ff9d]">
                {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold tracking-tight text-slate-900 dark:text-white truncate">
                {user?.name ?? "Usuario"}
              </p>
              <p className="text-[10px] font-mono tracking-widest text-slate-500 dark:text-gray-500 truncate">
                {user?.email ?? "-"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-gray-500 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-[#ff003c] transition-colors duration-300"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesion</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 min-h-0 min-w-0 overflow-y-auto overflow-x-hidden bg-slate-50 dark:bg-[#0a0a0a] transition-colors duration-300">
        <AnimatePresence>
          {offlineInfo.offline && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-amber-500/10 border-b border-amber-500/30 overflow-hidden"
            >
              <div className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-mono tracking-wide text-amber-700 dark:text-amber-400">
                <WifiOff className="w-3.5 h-3.5 flex-shrink-0" />
                <span>
                  MODO OFFLINE — Deteccion de plagas (YOLO) activa. IA
                  interpretativa y almacenamiento en la nube no disponibles.
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {children}
      </main>
    </div>
  );
}
