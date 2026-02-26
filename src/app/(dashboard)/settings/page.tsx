"use client";

import { Bell, User, Lock, Globe, Mail, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export default function SettingsPage() {
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const { theme, setTheme } = useTheme();
    const [language, setLanguage] = useState("en");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isDark = mounted ? theme === "dark" : false;

    const toggleDarkMode = () => {
        setTheme(isDark ? "light" : "dark");
    };

    return (
        <div className="p-8 max-w-4xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Configuración</h1>
                <p className="text-gray-600 dark:text-gray-400">Administra tu cuenta y preferencias de la aplicación</p>
            </div>

            <div className="space-y-6">
                {/* Profile Settings */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-[#FF6347]" />
                        Configuración de Perfil
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Nombre Completo
                            </label>
                            <input
                                type="text"
                                defaultValue="Juan Agricultor"
                                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6347] focus:border-transparent text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Correo Electrónico
                            </label>
                            <input
                                type="email"
                                defaultValue="john.farmer@example.com"
                                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6347] focus:border-transparent text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Nombre de la Finca
                            </label>
                            <input
                                type="text"
                                defaultValue="Finca de Tomates Valle Verde"
                                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6347] focus:border-transparent text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>
                </div>

                {/* Notification Settings */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Bell className="w-5 h-5 text-[#FF6347]" />
                        Notificaciones
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Notificaciones por Correo</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Recibir alertas de detección de plagas por correo electrónico
                                </p>
                            </div>
                            <button
                                onClick={() => setEmailNotifications(!emailNotifications)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${emailNotifications ? "bg-[#32CD32]" : "bg-gray-300 dark:bg-gray-600"
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${emailNotifications ? "translate-x-6" : "translate-x-1"
                                        }`}
                                />
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Notificaciones Push</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Recibir alertas instantáneas en tu dispositivo
                                </p>
                            </div>
                            <button
                                onClick={() => setPushNotifications(!pushNotifications)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${pushNotifications ? "bg-[#32CD32]" : "bg-gray-300 dark:bg-gray-600"
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${pushNotifications ? "translate-x-6" : "translate-x-1"
                                        }`}
                                />
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Reportes Semanales</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Recibir reportes resumen cada lunes
                                </p>
                            </div>
                            <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <Mail className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Appearance */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        {isDark ? (
                            <Moon className="w-5 h-5 text-[#FF6347]" />
                        ) : (
                            <Sun className="w-5 h-5 text-[#FF6347]" />
                        )}
                        Apariencia
                    </h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">Modo Oscuro</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Alternar tema de modo oscuro
                            </p>
                        </div>
                        <button
                            onClick={toggleDarkMode}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isDark ? "bg-[#32CD32]" : "bg-gray-300"
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDark ? "translate-x-6" : "translate-x-1"
                                    }`}
                            />
                        </button>
                    </div>
                </div>

                {/* Language & Region */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-[#FF6347]" />
                        Idioma y Región
                    </h2>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Idioma de Visualización
                        </label>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6347] focus:border-transparent text-gray-900 dark:text-white"
                        >
                            <option value="en">Inglés</option>
                            <option value="es">Español</option>
                            <option value="fr">Francés</option>
                            <option value="de">Alemán</option>
                            <option value="zh">Chino</option>
                        </select>
                    </div>
                </div>

                {/* Security */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-[#FF6347]" />
                        Seguridad
                    </h2>
                    <div className="space-y-3">
                        <button className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left font-medium">
                            Cambiar Contraseña
                        </button>
                        <button className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left font-medium">
                            Autenticación de Dos Factores
                        </button>
                        <button className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left font-medium">
                            Dispositivos Conectados
                        </button>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                    <button className="flex-1 bg-[#FF6347] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#ff4530] transition-colors">
                        Guardar Cambios
                    </button>
                    <button className="px-6 py-3 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}
