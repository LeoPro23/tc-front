"use client";

import { Bell, User, Lock, Globe, Mail, Moon, Sun, Loader2, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { getUser, saveUser } from "@/lib/auth-helpers";
import { getProfile, updateProfile, changePassword, toggle2Fa, getConnectedDevices } from "@/data/profile";

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Profile State
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [farmName, setFarmName] = useState("");
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [isSavingProfile, setIsSavingProfile] = useState(false);

    // Notifications & Preferences State
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [language, setLanguage] = useState("es");

    // Security State
    const [is2FaEnabled, setIs2FaEnabled] = useState(false);
    const [isSaving2Fa, setIsSaving2Fa] = useState(false);
    const [devices, setDevices] = useState<any[]>([]);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    // Password state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordError, setPasswordError] = useState("");

    useEffect(() => {
        setMounted(true);
        loadProfileData();
    }, []);

    const loadProfileData = async () => {
        setIsLoadingProfile(true);
        try {
            // First try to load from local storage cache
            const localUser: any = getUser();
            if (localUser) {
                setName(localUser.name || "");
                setEmail(localUser.email || "");
            }

            // Fetch fresh data from API
            const profile = await getProfile();
            setName(profile.name || "");
            setEmail(profile.email || "");
            setFarmName(profile.farmName || "");
            setIs2FaEnabled(profile.isTwoFactorEnabled || false);

            if (localUser) {
                saveUser({ ...localUser, ...profile });
            }

            // Fetch devices
            const connectedDevices = await getConnectedDevices();
            setDevices(connectedDevices);
        } catch (error) {
            console.error("Error loading profile:", error);
        } finally {
            setIsLoadingProfile(false);
        }
    };

    const handleSaveProfile = async () => {
        setIsSavingProfile(true);
        try {
            const updated = await updateProfile({ name, email, farmName });

            // Actualizar local storage
            const localUser: any = getUser();
            if (localUser) {
                saveUser({ ...localUser, ...updated });
            }
            alert("Perfil actualizado correctamente");
        } catch (error: any) {
            alert(error.message || "Error al actualizar perfil");
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handleToggle2Fa = async () => {
        setIsSaving2Fa(true);
        try {
            const newState = !is2FaEnabled;
            await toggle2Fa(newState);
            setIs2FaEnabled(newState);
        } catch (error: any) {
            alert(error.message || "Error al cambiar 2FA");
        } finally {
            setIsSaving2Fa(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError("");
        if (newPassword !== confirmPassword) {
            setPasswordError("Las contraseñas nuevas no coinciden");
            return;
        }

        setIsChangingPassword(true);
        try {
            await changePassword(currentPassword, newPassword);
            alert("Contraseña actualizada correctamente");
            setShowPasswordModal(false);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: any) {
            setPasswordError(error.message || "Error al cambiar la contraseña");
        } finally {
            setIsChangingPassword(false);
        }
    };

    const isDark = mounted ? theme === "dark" : false;
    const toggleDarkMode = () => setTheme(isDark ? "light" : "dark");

    if (!mounted) return null;

    return (
        <div className="p-8 max-w-4xl relative">
            {/* Header */}
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Configuración</h1>
                    <p className="text-slate-600 dark:text-slate-400">Administra tu cuenta y preferencias de la aplicación</p>
                </div>
                <button
                    onClick={handleSaveProfile}
                    disabled={isSavingProfile || isLoadingProfile}
                    className="flex text-sm items-center gap-2 bg-emerald-600 dark:bg-[#00ff9d] text-white dark:text-black px-5 py-2.5 rounded-lg font-bold hover:brightness-110 transition-all disabled:opacity-50"
                >
                    {isSavingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Guardar Cambios
                </button>
            </div>

            <div className="space-y-6">
                {/* Profile Settings */}
                <div className="bg-white dark:bg-[#0d0d0d] rounded-xl p-6 shadow-sm border border-slate-200 dark:border-white/10">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-emerald-600 dark:text-[#00ff9d]" />
                        Configuración de Perfil
                    </h2>

                    {isLoadingProfile ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="w-8 h-8 animate-spin text-emerald-600 dark:text-[#00ff9d]" />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Nombre Completo
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-[#111]/80 border border-slate-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-[#111]/80 border border-slate-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Nombre de la Finca
                                </label>
                                <input
                                    type="text"
                                    value={farmName}
                                    onChange={(e) => setFarmName(e.target.value)}
                                    placeholder="Ej: Finca Valle Verde"
                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-[#111]/80 border border-slate-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-600"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Security */}
                <div className="bg-white dark:bg-[#0d0d0d] rounded-xl p-6 shadow-sm border border-slate-200 dark:border-white/10">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-emerald-600 dark:text-[#00ff9d]" />
                        Seguridad
                    </h2>

                    <div className="space-y-4">
                        {/* Change Password Button */}
                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#111]/50 border border-slate-200 dark:border-white/5 rounded-lg">
                            <div>
                                <p className="font-medium text-slate-900 dark:text-white">Contraseña</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Actualiza tu clave de acceso neuronal</p>
                            </div>
                            <button
                                onClick={() => setShowPasswordModal(true)}
                                className="px-4 py-2 bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-white/20 transition-colors text-sm"
                            >
                                Cambiar
                            </button>
                        </div>

                        {/* 2FA Toggle */}
                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#111]/50 border border-slate-200 dark:border-white/5 rounded-lg">
                            <div>
                                <p className="font-medium text-slate-900 dark:text-white">Autenticación de Dos Factores (2FA)</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Aumenta la seguridad de tu cuenta</p>
                            </div>
                            <button
                                onClick={handleToggle2Fa}
                                disabled={isLoadingProfile || isSaving2Fa}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${is2FaEnabled ? "bg-emerald-500 dark:bg-[#00ff9d]" : "bg-slate-300 dark:bg-slate-600"} disabled:opacity-50`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${is2FaEnabled ? "translate-x-6" : "translate-x-1"}`} />
                            </button>
                        </div>

                        {/* Connected Devices */}
                        <div className="p-4 bg-slate-50 dark:bg-[#111]/50 border border-slate-200 dark:border-white/5 rounded-lg">
                            <p className="font-medium text-slate-900 dark:text-white mb-2">Dispositivos Conectados</p>
                            {devices.length === 0 ? (
                                <p className="text-sm text-slate-500 dark:text-slate-400">Cargando dispositivos...</p>
                            ) : (
                                <ul className="space-y-3">
                                    {devices.map((d: any) => (
                                        <li key={d.userSessionId} className="text-sm flex flex-col gap-1 text-slate-600 dark:text-slate-300 bg-white dark:bg-[#1a1a1a] p-3 rounded-md border border-slate-100 dark:border-white/5 shadow-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]"></span>
                                                <strong className="text-slate-900 dark:text-white truncate">{d.userAgent || 'Dispositivo Desconocido'}</strong>
                                            </div>
                                            <div className="text-xs text-slate-500 flex justify-between ml-4">
                                                <span>IP: {d.ipAddress || 'Oculta'}</span>
                                                <span>Activo: {new Date(d.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                {/* Appearance */}
                <div className="bg-white dark:bg-[#0d0d0d] rounded-xl p-6 shadow-sm border border-slate-200 dark:border-white/10">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        {isDark ? (
                            <Moon className="w-5 h-5 text-emerald-600 dark:text-[#00ff9d]" />
                        ) : (
                            <Sun className="w-5 h-5 text-emerald-600 dark:text-[#00ff9d]" />
                        )}
                        Apariencia
                    </h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-slate-900 dark:text-white">Modo Oscuro</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Alternar tema de la aplicación
                            </p>
                        </div>
                        <button
                            onClick={toggleDarkMode}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isDark ? "bg-[#00ff9d]" : "bg-slate-300"
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDark ? "translate-x-6" : "translate-x-1"
                                    }`}
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-[#0d0d0d] border border-slate-200 dark:border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Cambiar Contraseña</h3>

                        {passwordError && (
                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs rounded-lg">
                                {passwordError}
                            </div>
                        )}

                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Contraseña Actual
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#111]/80 border border-slate-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Nueva Contraseña
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#111]/80 border border-slate-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Confirmar Nueva Contraseña
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#111]/80 border border-slate-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-900 dark:text-white"
                                />
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordModal(false)}
                                    className="flex-1 px-4 py-2 bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white rounded-lg text-sm font-medium hover:bg-slate-300 dark:hover:bg-white/20"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isChangingPassword}
                                    className="flex-1 px-4 py-2 bg-emerald-600 dark:bg-[#00ff9d] text-white dark:text-black rounded-lg text-sm font-bold flex justify-center items-center gap-2 hover:brightness-110 disabled:opacity-50"
                                >
                                    {isChangingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : "Actualizar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
