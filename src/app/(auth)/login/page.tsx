"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Dna, Eye, EyeOff, Loader2, AlertCircle, Leaf } from "lucide-react";
import { loginUser } from "@/data/auth";
import { saveToken, saveUser, isAuthenticated } from "@/lib/auth-helpers";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated()) router.replace("/");
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      saveToken(res.accessToken);
      saveUser(res.user);
      router.push("/");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#0a0a0a] transition-colors duration-500 flex items-center justify-center overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#05966910_1px,transparent_1px),linear-gradient(to_bottom,#05966910_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#00ff9d08_1px,transparent_1px),linear-gradient(to_bottom,#00ff9d08_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Radial glow center */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(5,150,105,0.06))] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(0,255,157,0.06),transparent)]" />

      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-emerald-600 dark:bg-[#00ff9d] rounded-full opacity-30"
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
      <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-[#00ff9d]/20" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-[#00ff9d]/20" />
      <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-[#00ff9d]/10" />
      <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-[#00ff9d]/10" />

      {/* Scan line animation */}
      <motion.div
        animate={{ top: ["-2%", "102%"] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-600/20 dark:via-[#00ff9d]/20 to-transparent pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-md mx-4"
      >
        {/* Glow border effect */}
        <div className="absolute -inset-[1px] bg-gradient-to-b from-emerald-500/30 dark:from-[#00ff9d]/30 via-emerald-500/5 dark:via-[#00ff9d]/5 to-transparent rounded-2xl blur-sm" />

        <div className="relative bg-white/95 dark:bg-[#0d0d0d]/95 backdrop-blur-xl border border-slate-200 dark:border-[#00ff9d]/15 rounded-2xl p-8 shadow-xl dark:shadow-2xl">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 20px rgba(0,255,157,0.2)",
                  "0 0 40px rgba(0,255,157,0.4)",
                  "0 0 20px rgba(0,255,157,0.2)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-16 h-16 bg-[#00ff9d]/10 border border-[#00ff9d]/30 rounded-2xl flex items-center justify-center mb-4"
            >
              <Dna className="w-8 h-8 text-emerald-600 dark:text-[#00ff9d]" />
            </motion.div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Leaf className="w-4 h-4 text-[#FF6347]" />
                <p className="text-[10px] font-mono text-slate-500 dark:text-gray-500 tracking-[0.35em] uppercase">
                  Sistema Neural Agrícola
                </p>
              </div>
              <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">
                TOMATO
                <span className="text-emerald-600 dark:text-[#00ff9d] drop-shadow-[0_0_12px_rgba(16,185,129,0.4)] dark:drop-shadow-[0_0_12px_rgba(0,255,157,0.6)]">
                  CODE
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-gray-500 font-mono mt-1 tracking-widest">
                AUTENTICACIÓN · NIVEL 3
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-emerald-500/20 dark:to-[#00ff9d]/20" />
            <span className="text-[10px] font-mono text-emerald-600 dark:text-[#00ff9d]/50 tracking-widest">
              ACCESO AUTORIZADO
            </span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-emerald-500/20 dark:to-[#00ff9d]/20" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="group">
              <label className="block text-[10px] font-mono text-slate-500 dark:text-gray-500 tracking-[0.2em] uppercase mb-2">
                Identificador Neural (Email)
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="usuario@tomatocode.ai"
                  className="w-full bg-slate-100/80 dark:bg-[#111]/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm font-mono px-4 py-3 rounded-xl outline-none placeholder:text-slate-400 dark:text-gray-700 focus:border-emerald-500/50 dark:focus:border-[#00ff9d]/50 focus:shadow-[0_0_15px_rgba(16,185,129,0.1)] dark:shadow-[0_0_15px_rgba(0,255,157,0.1)] transition-all duration-300"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#00ff9d]/0 group-focus-within:bg-emerald-500 dark:group-focus-within:bg-[#00ff9d] transition-colors shadow-[0_0_8px_rgba(16,185,129,0.4)] dark:shadow-[0_0_8px_rgba(0,255,157,0.6)]" />
              </div>
            </div>

            {/* Password */}
            <div className="group">
              <label className="block text-[10px] font-mono text-slate-500 dark:text-gray-500 tracking-[0.2em] uppercase mb-2">
                Clave de Acceso
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-slate-100/80 dark:bg-[#111]/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm font-mono px-4 py-3 pr-12 rounded-xl outline-none placeholder:text-slate-500 dark:text-gray-600 focus:border-emerald-500/50 dark:focus:border-[#00ff9d]/50 focus:shadow-[0_0_15px_rgba(16,185,129,0.1)] dark:shadow-[0_0_15px_rgba(0,255,157,0.1)] transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-gray-600 hover:text-emerald-600 dark:text-[#00ff9d] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 bg-red-500/10 dark:bg-[#ff003c]/10 border border-red-500/20 dark:border-[#ff003c]/20 rounded-xl px-4 py-3"
                >
                  <AlertCircle className="w-4 h-4 text-red-500 dark:text-[#ff003c] flex-shrink-0" />
                  <p className="text-xs text-red-500 dark:text-[#ff003c] font-mono">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="relative w-full overflow-hidden group mt-2"
            >
              <div className="absolute -inset-[1px] bg-gradient-to-r from-emerald-500 dark:from-[#00ff9d] to-emerald-400 rounded-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300 blur-[2px]" />
              <div className="relative w-full bg-white dark:bg-[#0d0d0d] border border-[#00ff9d]/50 group-hover:border-emerald-500 dark:group-hover:border-[#00ff9d] rounded-xl px-6 py-3.5 flex items-center justify-center gap-3 font-black text-sm tracking-widest text-emerald-600 dark:text-[#00ff9d] uppercase transition-all duration-300">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    AUTENTICANDO...
                  </>
                ) : (
                  <>
                    <span className="relative">
                      INICIAR SESIÓN NEURAL
                      {/* scan shimmer */}
                      <motion.span
                        animate={{ left: ["-100%", "200%"] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                          repeatDelay: 1,
                        }}
                        className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-emerald-500/30 dark:via-[#00ff9d]/30 to-transparent skew-x-12"
                      />
                    </span>
                  </>
                )}
              </div>
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500 dark:text-gray-600 font-mono">
              ¿Sin acceso al sistema?{" "}
              <Link
                href="/register"
                className="text-emerald-600 dark:text-[#00ff9d]/70 hover:text-emerald-600 dark:text-[#00ff9d] transition-colors font-bold"
              >
                CREAR CUENTA
              </Link>
            </p>
          </div>

          {/* Status bar */}
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9d] animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.5)] dark:shadow-[0_0_6px_rgba(0,255,157,0.8)]" />
              <span className="text-[9px] font-mono text-slate-500 dark:text-gray-600 tracking-widest">
                SISTEMA ACTIVO
              </span>
            </div>
            <span className="text-[9px] font-mono text-slate-400 dark:text-gray-700 tracking-widest">
              v4.2.1 // AUTH
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
