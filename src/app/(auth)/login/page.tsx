"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Eye, EyeOff, Leaf, Loader2 } from "lucide-react";
import { loginUser } from "@/data/auth";
import { isAuthenticated, saveToken, saveUser } from "@/lib/auth-helpers";
import { AuthShell } from "@/presentation/components/auth/AuthShell";

const PASSWORD_PLACEHOLDER = "\u2022".repeat(12);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"CREDENTIALS" | "2FA">("CREDENTIALS");
  const [otpCode, setOtpCode] = useState("");

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/");
    }
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res =
        step === "CREDENTIALS"
          ? await loginUser({ email, password })
          : await loginUser({ email, password, otpCode });

      saveToken(res.accessToken);
      saveUser(res.user);
      router.push("/");
    } catch (err) {
      if ((err as Error).message === "2FA_REQUIRED") {
        setStep("2FA");
        setError(null);
      } else {
        setError((err as Error).message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative mx-auto w-full max-w-md lg:ml-auto lg:mr-0"
      >
        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-emerald-500/30 via-emerald-500/5 to-transparent blur-sm dark:from-[#00ff9d]/30 dark:via-[#00ff9d]/5" />

        <div className="relative rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-xl backdrop-blur-xl dark:border-[#00ff9d]/15 dark:bg-[#0d0d0d]/95 dark:shadow-2xl sm:p-8">
          <div className="mb-8 flex flex-col items-center">
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 20px rgba(0,255,157,0.2)",
                  "0 0 40px rgba(0,255,157,0.4)",
                  "0 0 20px rgba(0,255,157,0.2)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#00ff9d]/30 bg-[#00ff9d]/10 p-2"
            >
              <Image
                src="/images/logo-bg-transparent.png"
                alt="PlagaCode AI"
                width={48}
                height={48}
                priority
                className="h-auto w-full object-contain"
              />
            </motion.div>

            <div className="text-center">
              <div className="mb-1 flex items-center justify-center gap-2">
                <Leaf className="h-4 w-4 text-[#FF6347]" />
                <p className="text-[10px] font-mono uppercase tracking-[0.35em] text-slate-500 dark:text-gray-500">
                  Sistema Neural Agricola
                </p>
              </div>
              <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">
                PLAGA
                <span className="text-emerald-600 drop-shadow-[0_0_12px_rgba(16,185,129,0.4)] dark:text-[#00ff9d] dark:drop-shadow-[0_0_12px_rgba(0,255,157,0.6)]">
                  CODE
                </span>
              </h1>
              <p className="mt-1 text-xs font-mono tracking-widest text-slate-500 dark:text-gray-500">
                AUTENTICACION {"\u00B7"} NIVEL 3
              </p>
            </div>
          </div>

          <div className="mb-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-emerald-500/20 dark:to-[#00ff9d]/20" />
            <span className="text-[10px] font-mono tracking-widest text-emerald-600 dark:text-[#00ff9d]/50">
              ACCESO AUTORIZADO
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-emerald-500/20 dark:to-[#00ff9d]/20" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === "CREDENTIALS" ? (
              <>
                <div className="group">
                  <label className="mb-2 block text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 dark:text-gray-500">
                    Identificador neural (email)
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="usuario@plagacode.ai"
                      className="w-full rounded-xl border border-slate-200 bg-slate-100/80 px-4 py-3 text-sm font-mono text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-emerald-500/50 focus:shadow-[0_0_15px_rgba(16,185,129,0.1)] dark:border-white/10 dark:bg-[#111]/80 dark:text-white dark:placeholder:text-gray-700 dark:focus:border-[#00ff9d]/50 dark:focus:shadow-[0_0_15px_rgba(0,255,157,0.1)]"
                    />
                    <div className="absolute right-3 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#00ff9d]/0 shadow-[0_0_8px_rgba(16,185,129,0.4)] transition-colors group-focus-within:bg-emerald-500 dark:shadow-[0_0_8px_rgba(0,255,157,0.6)] dark:group-focus-within:bg-[#00ff9d]" />
                  </div>
                </div>

                <div className="group">
                  <label className="mb-2 block text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 dark:text-gray-500">
                    Clave de acceso
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder={PASSWORD_PLACEHOLDER}
                      className="w-full rounded-xl border border-slate-200 bg-slate-100/80 px-4 py-3 pr-12 text-sm font-mono text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-emerald-500/50 focus:shadow-[0_0_15px_rgba(16,185,129,0.1)] dark:border-white/10 dark:bg-[#111]/80 dark:text-white dark:placeholder:text-gray-600 dark:focus:border-[#00ff9d]/50 dark:focus:shadow-[0_0_15px_rgba(0,255,157,0.1)]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-emerald-600 dark:text-gray-600 dark:hover:text-[#00ff9d]"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <motion.div
                key="2fa-step"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group"
              >
                <div className="mb-6 text-center">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Tu cuenta esta protegida. Ingresa el codigo de 6 digitos de
                    tu aplicacion de autenticacion.
                  </p>
                </div>
                <label className="mb-2 block text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 dark:text-gray-500">
                  Codigo de autenticacion 2FA
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    required
                    placeholder="000000"
                    className="w-full rounded-xl border border-slate-200 bg-slate-100/80 px-4 py-3 text-center text-lg font-mono tracking-widest text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-emerald-500/50 focus:shadow-[0_0_15px_rgba(16,185,129,0.1)] dark:border-white/10 dark:bg-[#111]/80 dark:text-white dark:placeholder:text-gray-700 dark:focus:border-[#00ff9d]/50 dark:focus:shadow-[0_0_15px_rgba(0,255,157,0.1)]"
                  />
                </div>
              </motion.div>
            )}

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 dark:border-[#ff003c]/20 dark:bg-[#ff003c]/10"
                >
                  <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-500 dark:text-[#ff003c]" />
                  <p className="text-xs font-mono text-red-500 dark:text-[#ff003c]">
                    {error}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="group relative mt-2 w-full overflow-hidden"
            >
              <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 opacity-70 blur-[2px] transition-opacity duration-300 group-hover:opacity-100 dark:from-[#00ff9d]" />
              <div className="relative flex w-full items-center justify-center gap-3 rounded-xl border border-[#00ff9d]/50 bg-white px-6 py-3.5 text-sm font-black uppercase tracking-widest text-emerald-600 transition-all duration-300 group-hover:border-emerald-500 dark:bg-[#0d0d0d] dark:text-[#00ff9d] dark:group-hover:border-[#00ff9d]">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    AUTENTICANDO...
                  </>
                ) : (
                  <span className="relative">
                    {step === "CREDENTIALS"
                      ? "INICIAR SESION NEURAL"
                      : "VERIFICAR CODIGO"}
                    <motion.span
                      animate={{ left: ["-100%", "200%"] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                        repeatDelay: 1,
                      }}
                      className="absolute left-0 top-0 h-full w-1/2 skew-x-12 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent dark:via-[#00ff9d]/30"
                    />
                  </span>
                )}
              </div>
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs font-mono text-slate-500 dark:text-gray-600">
              Sin acceso al sistema?{" "}
              <Link
                href="/register"
                className="font-bold text-emerald-600 transition-colors hover:text-emerald-700 dark:text-[#00ff9d]/70 dark:hover:text-[#00ff9d]"
              >
                CREAR CUENTA
              </Link>
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4 dark:border-white/5">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00ff9d] shadow-[0_0_6px_rgba(16,185,129,0.5)] dark:shadow-[0_0_6px_rgba(0,255,157,0.8)]" />
              <span className="text-[9px] font-mono tracking-widest text-slate-500 dark:text-gray-600">
                SISTEMA ACTIVO
              </span>
            </div>
            <span className="text-[9px] font-mono tracking-widest text-slate-400 dark:text-gray-700">
              v4.2.1 // AUTH
            </span>
          </div>
        </div>
      </motion.div>
    </AuthShell>
  );
}
