"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dna,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  Leaf,
  User,
} from "lucide-react";
import { registerUser } from "@/data/auth";
import { saveToken, saveUser, isAuthenticated } from "@/lib/auth-helpers";

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
    if (isAuthenticated()) router.replace("/");
  }, [router]);

  function set(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      // Redirigir al login para que el usuario ingrese sus datos completos
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
      label: "Nombre de Operador",
      type: "text",
      placeholder: "Juan Agricultor",
      value: form.name,
      onChange: set("name"),
      icon: <User className="w-4 h-4" />,
      showToggle: false,
    },
    {
      id: "email",
      label: "Identificador Neural (Email)",
      type: "email",
      placeholder: "usuario@plagacode.ai",
      value: form.email,
      onChange: set("email"),
      showToggle: false,
    },
    {
      id: "password",
      label: "Clave de Acceso",
      type: showPassword ? "text" : "password",
      placeholder: "••••••••••••",
      value: form.password,
      onChange: set("password"),
      showToggle: true,
      show: showPassword,
      onToggle: () => setShowPassword(!showPassword),
    },
    {
      id: "confirm",
      label: "Confirmar Clave",
      type: showConfirm ? "text" : "password",
      placeholder: "••••••••••••",
      value: form.confirm,
      onChange: set("confirm"),
      showToggle: true,
      show: showConfirm,
      onToggle: () => setShowConfirm(!showConfirm),
    },
  ];

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#0a0a0a] transition-colors duration-500 flex items-center justify-center overflow-hidden py-8">
      {/* Animated grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#05966908_1px,transparent_1px),linear-gradient(to_bottom,#05966908_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#00ff9d06_1px,transparent_1px),linear-gradient(to_bottom,#00ff9d06_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(5,150,105,0.05))] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(0,255,157,0.05),transparent)]" />

      {/* Particles */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-emerald-600 dark:bg-[#00ff9d] rounded-full opacity-20"
          style={{ left: `${10 + i * 9}%`, top: `${20 + ((i * 13) % 60)}%` }}
          animate={{ y: [0, -20, 0], opacity: [0.1, 0.4, 0.1] }}
          transition={{
            duration: 3 + (i % 3),
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-28 h-28 border-t-2 border-l-2 border-[#00ff9d]/20" />
      <div className="absolute bottom-0 right-0 w-28 h-28 border-b-2 border-r-2 border-[#00ff9d]/20" />

      {/* Scan line */}
      <motion.div
        animate={{ top: ["-2%", "102%"] }}
        transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-600/15 dark:via-[#00ff9d]/15 to-transparent pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-md mx-4"
      >
        <div className="absolute -inset-[1px] bg-gradient-to-b from-emerald-500/25 dark:from-[#00ff9d]/25 via-emerald-500/5 dark:via-[#00ff9d]/5 to-transparent rounded-2xl blur-sm" />

        <div className="relative bg-white/95 dark:bg-[#0d0d0d]/95 backdrop-blur-xl border border-slate-200 dark:border-[#00ff9d]/15 rounded-2xl p-8 shadow-xl dark:shadow-2xl">
          {/* Header */}
          <div className="flex flex-col items-center mb-6">
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 20px rgba(0,255,157,0.15)",
                  "0 0 35px rgba(0,255,157,0.35)",
                  "0 0 20px rgba(0,255,157,0.15)",
                ],
              }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="w-14 h-14 bg-[#00ff9d]/10 border border-[#00ff9d]/30 rounded-xl flex items-center justify-center mb-4"
            >
              <Dna className="w-7 h-7 text-emerald-600 dark:text-[#00ff9d]" />
            </motion.div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Leaf className="w-3.5 h-3.5 text-[#FF6347]" />
                <p className="text-[10px] font-mono text-slate-500 dark:text-gray-500 tracking-[0.3em] uppercase">
                  Registro de Operador
                </p>
              </div>
              <h1 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">
                TOMATO
                <span className="text-emerald-600 dark:text-[#00ff9d] drop-shadow-[0_0_10px_rgba(16,185,129,0.4)] dark:drop-shadow-[0_0_10px_rgba(0,255,157,0.5)]">
                  CODE
                </span>
              </h1>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-emerald-500/20 dark:to-[#00ff9d]/20" />
            <span className="text-[10px] font-mono text-emerald-600 dark:text-[#00ff9d]/40 tracking-widest">
              NUEVO ACCESO
            </span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-emerald-500/20 dark:to-[#00ff9d]/20" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((field) => (
              <div key={field.id} className="group">
                <label className="block text-[10px] font-mono text-slate-500 dark:text-gray-500 tracking-[0.2em] uppercase mb-2">
                  {field.label}
                </label>
                <div className="relative">
                  <input
                    type={field.type}
                    value={field.value}
                    onChange={field.onChange}
                    required
                    placeholder={field.placeholder}
                    className="w-full bg-slate-100/80 dark:bg-[#111]/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm font-mono px-4 py-3 rounded-xl outline-none placeholder:text-slate-400 dark:text-gray-700 focus:border-emerald-500/50 dark:focus:border-[#00ff9d]/50 focus:shadow-[0_0_12px_rgba(16,185,129,0.08)] dark:shadow-[0_0_12px_rgba(0,255,157,0.08)] transition-all duration-300 pr-12"
                  />
                  {field.showToggle && (
                    <button
                      type="button"
                      onClick={field.onToggle}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-gray-600 hover:text-emerald-600 dark:text-[#00ff9d] transition-colors"
                    >
                      {field.show ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Password strength indicator */}
            {form.password && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-1"
              >
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((level) => {
                    const strength = Math.min(
                      4,
                      [
                        form.password.length >= 6,
                        form.password.length >= 10,
                        /[A-Z]/.test(form.password) ||
                        /[0-9]/.test(form.password),
                        /[!@#$%^&*]/.test(form.password),
                      ].filter(Boolean).length,
                    );
                    return (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors duration-300 ${level <= strength
                            ? strength <= 1
                              ? "bg-[#ff003c]"
                              : strength <= 2
                                ? "bg-orange-500"
                                : strength <= 3
                                  ? "bg-yellow-400"
                                  : "bg-[#00ff9d]"
                            : "bg-white/5"
                          }`}
                      />
                    );
                  })}
                </div>
                <p className="text-[9px] font-mono text-slate-500 dark:text-gray-600">
                  FORTALEZA DE CLAVE
                </p>
              </motion.div>
            )}

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
              className="relative w-full overflow-hidden group mt-1"
            >
              <div className="absolute -inset-[1px] bg-gradient-to-r from-emerald-500 dark:from-[#00ff9d] to-emerald-400 rounded-xl opacity-60 group-hover:opacity-90 transition-opacity duration-300 blur-[2px]" />
              <div className="relative w-full bg-white dark:bg-[#0d0d0d] border border-[#00ff9d]/50 group-hover:border-emerald-500 dark:group-hover:border-[#00ff9d] rounded-xl px-6 py-3.5 flex items-center justify-center gap-3 font-black text-sm tracking-widest text-emerald-600 dark:text-[#00ff9d] uppercase transition-all duration-300">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    REGISTRANDO...
                  </>
                ) : (
                  "ACTIVAR ACCESO NEURAL"
                )}
              </div>
            </motion.button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-xs text-slate-500 dark:text-gray-600 font-mono">
              ¿Ya tienes acceso?{" "}
              <Link
                href="/login"
                className="text-emerald-600 dark:text-[#00ff9d]/70 hover:text-emerald-600 dark:text-[#00ff9d] transition-colors font-bold"
              >
                INICIAR SESIÓN
              </Link>
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-200 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9d] animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.5)] dark:shadow-[0_0_6px_rgba(0,255,157,0.8)]" />
              <span className="text-[9px] font-mono text-slate-500 dark:text-gray-600 tracking-widest">
                REGISTRO ABIERTO
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
