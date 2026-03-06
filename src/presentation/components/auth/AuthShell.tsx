"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

function AuthIllustration({ className }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src="/images/auth/auth-light.png"
        alt="Vista del sistema de autenticacion"
        fill
        sizes="(max-width: 1024px) 100vw, 72vw"
        className="object-cover object-center [mask-image:radial-gradient(126%_118%_at_50%_50%,#000_52%,transparent_100%)] [-webkit-mask-image:radial-gradient(126%_118%_at_50%_50%,#000_52%,transparent_100%)] lg:[mask-image:linear-gradient(to_right,#000_80%,transparent_100%)] lg:[-webkit-mask-image:linear-gradient(to_right,#000_80%,transparent_100%)] dark:hidden"
      />
      <Image
        src="/images/auth/auth-dark.png"
        alt="Vista del sistema de autenticacion en modo oscuro"
        fill
        sizes="(max-width: 1024px) 100vw, 72vw"
        className="hidden object-cover object-center [mask-image:radial-gradient(126%_118%_at_50%_50%,#000_52%,transparent_100%)] [-webkit-mask-image:radial-gradient(126%_118%_at_50%_50%,#000_52%,transparent_100%)] lg:dark:[mask-image:linear-gradient(to_right,#000_80%,transparent_100%)] lg:dark:[-webkit-mask-image:linear-gradient(to_right,#000_80%,transparent_100%)] dark:block"
      />
    </div>
  );
}

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 transition-colors duration-500 dark:bg-[#0a0a0a] dark:text-white">
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#05966910_1px,transparent_1px),linear-gradient(to_bottom,#05966910_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#00ff9d08_1px,transparent_1px),linear-gradient(to_bottom,#00ff9d08_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Radial glow center */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(5,150,105,0.06))] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(0,255,157,0.06),transparent)]" />

      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-emerald-600 dark:bg-[#00ff9d] rounded-full opacity-30 pointer-events-none"
          style={{
            left: `${8 + i * 7.5}%`,
            top: `${15 + ((i * 17) % 70)}%`,
          }}
          animate={{
            y: [0, -24, 0],
            opacity: [0.15, 0.5, 0.15],
          }}
          transition={{
            duration: 3 + (i % 3),
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Corner decorative lines */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-[#00ff9d]/20 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-[#00ff9d]/20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-[#00ff9d]/10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-[#00ff9d]/10 pointer-events-none" />

      {/* Scan line animation */}
      <motion.div
        animate={{ top: ["-2%", "102%"] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-600/20 dark:via-[#00ff9d]/20 to-transparent pointer-events-none z-10"
      />

      <div className="relative flex min-h-screen w-full items-center px-4 py-6 sm:px-6 lg:p-0">
        <div className="grid w-full gap-6 lg:grid-cols-[1fr_minmax(440px,500px)] lg:items-center xl:grid-cols-[1fr_500px]">
          <div className="w-full lg:h-screen">
            <AuthIllustration className="h-[44vh] min-h-[300px] w-full lg:hidden" />
            <AuthIllustration className="hidden w-full lg:block lg:h-screen" />
          </div>

          <div className="w-full max-w-xl mx-auto lg:mx-0 lg:pr-8 xl:pr-14 lg:pl-10 xl:pl-14">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

type AuthBrandHeaderProps = {
  eyebrow: string;
  subline?: string;
};

export function AuthBrandHeader({
  eyebrow,
  subline,
}: AuthBrandHeaderProps) {
  return (
    <div className="mb-8 flex flex-col items-center text-center">
      <div className="mb-2 flex items-center gap-2">
        <Leaf className="h-4 w-4 text-[#FF6347]" />
        <p className="text-[10px] font-mono uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">
          {eyebrow}
        </p>
      </div>

      <Image
        src="/images/logo-bg-transparent.png"
        alt="PlagaCode AI"
        width={256}
        height={92}
        priority
        className="h-auto w-[148px] sm:w-[176px]"
      />

      {subline ? (
        <p className="mt-2 text-xs font-mono uppercase tracking-[0.28em] text-slate-500 dark:text-slate-500">
          {subline}
        </p>
      ) : null}
    </div>
  );
}
