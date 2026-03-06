"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Eye, EyeOff, Leaf, Loader2 } from "lucide-react";
import { registerUser } from "@/data/auth";
import { isAuthenticated } from "@/lib/auth-helpers";
import { AuthShell } from "@/presentation/components/auth/AuthShell";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/");
    }
  }, [router]);

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirm) {
      setError("Las contrasenas no coinciden");
      return;
    }

    if (form.password.length < 6) {
      setError("La contrasena debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      router.push("/login?registered=true");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const fields = [
    {
      id: "name",
      label: "Nombre de operador",
      type: "text",
      placeholder: "Juan Agricultor",
      value: form.name,
      onChange: set("name"),
      showToggle: false,
      show: false,
      onToggle: undefined,
    },
    {
      id: "email",
      label: "Identificador neural (email)",
      type: "email",
      placeholder: "usuario@plagacode.ai",
      value: form.email,
      onChange: set("email"),
      showToggle: false,
      show: false,
      onToggle: undefined,
    },
    {
      id: "password",
      label: "Clave de acceso",
      type: showPassword ? "text" : "password",
      placeholder: "••••••••••••",
      value: form.password,
      onChange: set("password"),
      showToggle: true,
      show: showPassword,
      onToggle: () => setShowPassword((prev) => !prev),
    },
    {
      id: "confirm",
      label: "Confirmar clave",
      type: showConfirm ? "text" : "password",
      placeholder: "••••••••••••",
      value: form.confirm,
      onChange: set("confirm"),
      showToggle: true,
      show: showConfirm,
      onToggle: () => setShowConfirm((prev) => !prev),
    },
  ];

  const passwordStrength = Math.min(
    4,
    [
      form.password.length >= 6,
      form.password.length >= 10,
      /[A-Z]/.test(form.password) || /[0-9]/.test(form.password),
      /[!@#$%^&*]/.test(form.password),
    ].filter(Boolean).length,
  );

  return (
    <AuthShell>
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative mx-auto w-full max-w-md lg:ml-auto lg:mr-0"
      >
        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-emerald-500/25 via-emerald-500/5 to-transparent blur-sm dark:from-[#00ff9d]/25 dark:via-[#00ff9d]/5" />

        <div className="relative rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-xl backdrop-blur-xl dark:border-[#00ff9d]/15 dark:bg-[#0d0d0d]/95 dark:shadow-2xl sm:p-8">
          <div className="mb-6 flex flex-col items-center">
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 20px rgba(0,255,157,0.15)",
                  "0 0 35px rgba(0,255,157,0.35)",
                  "0 0 20px rgba(0,255,157,0.15)",
                ],
              }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-[#00ff9d]/30 bg-[#00ff9d]/10 p-2"
            >
              <Image
                src="/images/logo-bg-transparent.png"
                alt="PlagaCode AI"
                width={40}
                height={40}
                priority
                className="h-auto w-full object-contain"
              />
            </motion.div>

            <div className="text-center">
              <div className="mb-1 flex items-center justify-center gap-2">
                <Leaf className="h-3.5 w-3.5 text-[#FF6347]" />
                <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-slate-500 dark:text-gray-500">
                  Registro de Operador
                </p>
              </div>
              <h1 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">
                PLAGA
                <span className="text-emerald-600 drop-shadow-[0_0_10px_rgba(16,185,129,0.4)] dark:text-[#00ff9d] dark:drop-shadow-[0_0_10px_rgba(0,255,157,0.5)]">
                  CODE
                </span>
              </h1>
            </div>
          </div>

          <div className="mb-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-emerald-500/20 dark:to-[#00ff9d]/20" />
            <span className="text-[10px] font-mono tracking-widest text-emerald-600 dark:text-[#00ff9d]/40">
              NUEVO ACCESO
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-emerald-500/20 dark:to-[#00ff9d]/20" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((field) => (
              <div key={field.id} className="group">
                <label className="mb-2 block text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 dark:text-gray-500">
                  {field.label}
                </label>
                <div className="relative">
                  <input
                    type={field.type}
                    value={field.value}
                    onChange={field.onChange}
                    required
                    placeholder={field.placeholder}
                    className="w-full rounded-xl border border-slate-200 bg-slate-100/80 px-4 py-3 pr-12 text-sm font-mono text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-emerald-500/50 focus:shadow-[0_0_12px_rgba(16,185,129,0.08)] dark:border-white/10 dark:bg-[#111]/80 dark:text-white dark:placeholder:text-gray-700 dark:focus:border-[#00ff9d]/50 dark:focus:shadow-[0_0_12px_rgba(0,255,157,0.08)]"
                  />
                  {field.showToggle && field.onToggle ? (
                    <button
                      type="button"
                      onClick={field.onToggle}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-emerald-600 dark:text-gray-600 dark:hover:text-[#00ff9d]"
                    >
                      {field.show ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  ) : null}
                </div>
              </div>
            ))}

            {form.password ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-1"
              >
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                        level <= passwordStrength
                          ? passwordStrength <= 1
                            ? "bg-[#ff003c]"
                            : passwordStrength <= 2
                              ? "bg-orange-500"
                              : passwordStrength <= 3
                                ? "bg-yellow-400"
                                : "bg-[#00ff9d]"
                          : "bg-slate-200 dark:bg-white/5"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-[9px] font-mono text-slate-500 dark:text-gray-600">
                  FORTALEZA DE CLAVE
                </p>
              </motion.div>
            ) : null}

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
              className="group relative mt-1 w-full overflow-hidden"
            >
              <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 opacity-60 blur-[2px] transition-opacity duration-300 group-hover:opacity-90 dark:from-[#00ff9d]" />
              <div className="relative flex w-full items-center justify-center gap-3 rounded-xl border border-[#00ff9d]/50 bg-white px-6 py-3.5 text-sm font-black uppercase tracking-widest text-emerald-600 transition-all duration-300 group-hover:border-emerald-500 dark:bg-[#0d0d0d] dark:text-[#00ff9d] dark:group-hover:border-[#00ff9d]">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    REGISTRANDO...
                  </>
                ) : (
                  "ACTIVAR ACCESO NEURAL"
                )}
              </div>
            </motion.button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-xs font-mono text-slate-500 dark:text-gray-600">
              Ya tienes acceso?{" "}
              <Link
                href="/login"
                className="font-bold text-emerald-600 transition-colors hover:text-emerald-700 dark:text-[#00ff9d]/70 dark:hover:text-[#00ff9d]"
              >
                INICIAR SESION
              </Link>
            </p>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4 dark:border-white/5">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00ff9d] shadow-[0_0_6px_rgba(16,185,129,0.5)] dark:shadow-[0_0_6px_rgba(0,255,157,0.8)]" />
              <span className="text-[9px] font-mono tracking-widest text-slate-500 dark:text-gray-600">
                REGISTRO ABIERTO
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
