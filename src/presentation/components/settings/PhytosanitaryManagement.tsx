import React, { useState, useEffect } from "react";
import { Loader2, Plus, Sprout, Calendar, MapPin, Link2, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { managementApi } from "@/lib/api/management.service";
import type { Campaign, Field, FieldCampaign } from "@/lib/api/management.types";
import { EditCampaignModal } from './EditCampaignModal';

export function PhytosanitaryManagement() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [fields, setFields] = useState<Field[]>([]);
    const [enrolledFields, setEnrolledFields] = useState<FieldCampaign[]>([]);

    const [activeTab, setActiveTab] = useState<"campaigns" | "fields" | "enrollment">("campaigns");
    const [isLoading, setIsLoading] = useState(true);

    const formatLocalDate = (isoString: string) => {
        if (!isoString) return '';
        const [year, month, day] = isoString.split('T')[0].split('-');
        return `${day}/${month}/${year}`;
    };

    // Formularios
    const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
    const [isCreatingField, setIsCreatingField] = useState(false);

    const [newCampaignStart, setNewCampaignStart] = useState("");
    const [newCampaignEnd, setNewCampaignEnd] = useState("");
    const [newFieldName, setNewFieldName] = useState("");

    const [enrollCampaignId, setEnrollCampaignId] = useState("");
    const [enrollFieldId, setEnrollFieldId] = useState("");
    const [isEnrolling, setIsEnrolling] = useState(false);

    // Modal de Edición de Campaña
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [campaignToEdit, setCampaignToEdit] = useState<Campaign | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (enrollCampaignId) {
            loadEnrolledFields(enrollCampaignId);
        } else {
            setEnrolledFields([]);
        }
    }, [enrollCampaignId]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const fetchedCampaigns = await managementApi.getCampaigns();
            setCampaigns(fetchedCampaigns);
            const fetchedFields = await managementApi.getFields();
            setFields(fetchedFields);

            if (fetchedCampaigns.length > 0) {
                setEnrollCampaignId(fetchedCampaigns[0].id);
            }
        } catch (error) {
            toast.error("Error al cargar los datos fitosanitarios");
        } finally {
            setIsLoading(false);
        }
    };

    const loadEnrolledFields = async (campaignId: string) => {
        try {
            const fetched = await managementApi.getEnrolledFields(campaignId);
            setEnrolledFields(fetched);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreateCampaign = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCampaignStart || !newCampaignEnd) {
            toast.error("Debes seleccionar inicio y fin");
            return;
        }
        setIsCreatingCampaign(true);
        try {
            const c = await managementApi.createCampaign(
                new Date(newCampaignStart + 'T12:00:00').toISOString(),
                new Date(newCampaignEnd + 'T12:00:00').toISOString()
            );
            setCampaigns(prev => [c, ...prev]);
            setNewCampaignStart("");
            setNewCampaignEnd("");
            toast.success("Campaña creada exitosamente");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Error al crear campaña");
        } finally {
            setIsCreatingCampaign(false);
        }
    };

    const handleCreateField = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newFieldName.trim()) {
            toast.error("Debes darle un nombre a este campo/lote");
            return;
        }
        setIsCreatingField(true);
        try {
            const f = await managementApi.createField(newFieldName.trim());
            setFields(prev => [f, ...prev]);
            setNewFieldName("");
            toast.success("Campo registrado correctamente");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Error al guardar campo");
        } finally {
            setIsCreatingField(false);
        }
    };

    const handleEnrollField = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!enrollCampaignId || !enrollFieldId) {
            toast.error("Falta información para la inscripción");
            return;
        }

        const alreadyEnrolled = enrolledFields.find(ef => ef.field.id === enrollFieldId);
        if (alreadyEnrolled) {
            toast.error("Este campo ya está inscrito en la campaña");
            return;
        }

        setIsEnrolling(true);
        try {
            const enrolled = await managementApi.enrollField(enrollFieldId, enrollCampaignId);
            setEnrolledFields(prev => [enrolled, ...prev]);
            setEnrollFieldId("");
            toast.success("Campo inscrito correctamente a la campaña");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Error al inscribir");
        } finally {
            setIsEnrolling(false);
        }
    };

    const handleEditCampaignClick = (campaign: Campaign) => {
        setCampaignToEdit(campaign);
        setIsEditModalOpen(true);
    };

    const handleSaveCampaignEdit = async (id: string, newStart: string, newEnd: string) => {
        try {
            const updated = await managementApi.updateCampaign(id, newStart, newEnd);
            setCampaigns(prev => prev.map(c => c.id === id ? updated : c));
            toast.success("Fechas de la campaña actualizadas satisfactoriamente");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Error al actualizar la campaña");
            throw err; // para que el modal no se cierre automáticamente en el try
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center p-8 bg-white dark:bg-[#0d0d0d] rounded-xl shadow-sm border border-slate-200 dark:border-white/10">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600 dark:text-[#00ff9d]" />
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-[#0d0d0d] rounded-xl shadow-sm border border-slate-200 dark:border-white/10 overflow-hidden">

            {/* Tabs */}
            <div className="flex border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#111]/50">
                <button
                    onClick={() => setActiveTab("campaigns")}
                    className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === "campaigns" ? "border-b-2 border-emerald-500 text-emerald-600 dark:text-[#00ff9d] dark:border-[#00ff9d]" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"}`}
                >
                    <Calendar className="w-4 h-4" /> Campañas Globales
                </button>
                <button
                    onClick={() => setActiveTab("fields")}
                    className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === "fields" ? "border-b-2 border-emerald-500 text-emerald-600 dark:text-[#00ff9d] dark:border-[#00ff9d]" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"}`}
                >
                    <Sprout className="w-4 h-4" /> Gestión de Campos
                </button>
                <button
                    onClick={() => setActiveTab("enrollment")}
                    className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === "enrollment" ? "border-b-2 border-emerald-500 text-emerald-600 dark:text-[#00ff9d] dark:border-[#00ff9d]" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"}`}
                >
                    <Link2 className="w-4 h-4" /> Inscripciones Activas
                </button>
            </div>

            <div className="p-6">
                {/* VIEW: Campañas */}
                {activeTab === "campaigns" && (
                    <div className="space-y-6">
                        <form onSubmit={handleCreateCampaign} className="p-4 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 rounded-xl space-y-4">
                            <h3 className="text-sm font-bold text-slate-800 dark:text-gray-200 uppercase tracking-wider mb-2">Crear Nueva Instancia (Campaña)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Fecha de Inicio</label>
                                    <input type="date" required value={newCampaignStart} onChange={e => setNewCampaignStart(e.target.value)} className="w-full bg-white dark:bg-[#111] border border-slate-200 dark:border-white/10 rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500 dark:text-white dark:[color-scheme:dark]" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Fecha de Fin Estimada</label>
                                    <input type="date" required value={newCampaignEnd} onChange={e => setNewCampaignEnd(e.target.value)} className="w-full bg-white dark:bg-[#111] border border-slate-200 dark:border-white/10 rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500 dark:text-white dark:[color-scheme:dark]" />
                                </div>
                            </div>
                            <button type="submit" disabled={isCreatingCampaign} className="px-4 py-2 bg-emerald-600 dark:bg-[#00ff9d] text-white dark:text-black font-bold text-xs rounded-lg flex items-center gap-2 disabled:opacity-50">
                                {isCreatingCampaign ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Generar Campaña
                            </button>
                        </form>

                        <div className="space-y-3">
                            <h3 className="text-sm font-bold text-slate-800 dark:text-gray-200 uppercase tracking-wider">Histórico de Campañas</h3>
                            {campaigns.length === 0 ? <p className="text-sm text-slate-500">No hay campañas registradas.</p> : (
                                <ul className="space-y-2">
                                    {campaigns.map(c => (
                                        <li key={c.id} className="p-3 bg-white dark:bg-[#181818] border border-slate-200 dark:border-white/10 rounded-lg flex justify-between items-center text-sm">
                                            <div>
                                                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${c.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-slate-400'}`}></span>
                                                <span className="font-medium text-slate-900 dark:text-white">Campaña {c.id.split('-')[0]}</span>
                                            </div>
                                            <div className="text-slate-500 flex items-center gap-2 text-xs">
                                                <span>{new Date(c.startDate).toLocaleDateString()} al {new Date(c.endDate).toLocaleDateString()}</span>
                                                <button
                                                    onClick={() => handleEditCampaignClick(c)}
                                                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-md transition-colors text-slate-400 hover:text-emerald-500"
                                                    title="Editar Fechas de la Campaña"
                                                >
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                )}

                {/* VIEW: Campos Libres */}
                {activeTab === "fields" && (
                    <div className="space-y-6">
                        <form onSubmit={handleCreateField} className="p-4 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 rounded-xl space-y-4">
                            <h3 className="text-sm font-bold text-slate-800 dark:text-gray-200 uppercase tracking-wider mb-2">Registrar Nuevo Campo Terrestre</h3>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Identificador o Nombre del Campo</label>
                                <input type="text" placeholder="Ej. Lote Norte, Casilla 4B" required value={newFieldName} onChange={e => setNewFieldName(e.target.value)} className="w-full bg-white dark:bg-[#111] border border-slate-200 dark:border-white/10 rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500 dark:text-white" />
                            </div>
                            <button type="submit" disabled={isCreatingField} className="px-4 py-2 bg-emerald-600 dark:bg-[#00ff9d] text-white dark:text-black font-bold text-xs rounded-lg flex items-center gap-2 disabled:opacity-50">
                                {isCreatingField ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />} Registrar Campo
                            </button>
                        </form>

                        <div className="space-y-3">
                            <h3 className="text-sm font-bold text-slate-800 dark:text-gray-200 uppercase tracking-wider">Inventario de Campos</h3>
                            {fields.length === 0 ? <p className="text-sm text-slate-500">No hay campos base registrados.</p> : (
                                <ul className="space-y-2">
                                    {fields.map(f => (
                                        <li key={f.id} className="p-3 bg-white dark:bg-[#181818] border border-slate-200 dark:border-white/10 rounded-lg flex justify-between items-center text-sm">
                                            <span className="font-medium text-slate-900 dark:text-white">{f.name}</span>
                                            <span className="text-slate-400 text-xs">Añadido: {formatLocalDate(f.createdAt)}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                )}

                {/* VIEW: Enrollments */}
                {activeTab === "enrollment" && (
                    <div className="space-y-6">
                        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl space-y-4">
                            <h3 className="text-sm font-bold text-emerald-800 dark:text-[#00ff9d] uppercase tracking-wider mb-2">Inscribir Campo a Campaña</h3>
                            <form onSubmit={handleEnrollField} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end">
                                <div>
                                    <label className="block text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-1">Campaña Activa</label>
                                    <select value={enrollCampaignId} onChange={e => setEnrollCampaignId(e.target.value)} required className="w-full bg-white dark:bg-[#111] border border-emerald-200 dark:border-white/10 rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500 dark:text-white">
                                        {campaigns.map(c => <option key={c.id} value={c.id}>ID: {c.id.split('-')[0]} (Inicio: {formatLocalDate(c.startDate)})</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-1">Campo Base a Inscribir</label>
                                    <select value={enrollFieldId} onChange={e => setEnrollFieldId(e.target.value)} required className="w-full bg-white dark:bg-[#111] border border-emerald-200 dark:border-white/10 rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500 dark:text-white">
                                        <option value="" disabled>-- Seleccione Campo --</option>
                                        {fields.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                                    </select>
                                </div>
                                <button type="submit" disabled={isEnrolling || !enrollCampaignId || !enrollFieldId} className="px-4 py-2 h-[38px] bg-emerald-600 dark:bg-[#00ff9d] text-white dark:text-black font-bold text-xs rounded-lg flex items-center justify-center gap-2 disabled:opacity-50">
                                    {isEnrolling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />} Enrolar
                                </button>
                            </form>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-sm font-bold text-slate-800 dark:text-gray-200 uppercase tracking-wider">Campos Disponibles en esta Campaña</h3>
                            {enrolledFields.length === 0 ? <p className="text-sm text-slate-500">Ningún campo ha sido adjuntado todavía a la campaña superior.</p> : (
                                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                    {enrolledFields.map(ef => (
                                        <li key={ef.id} className="p-4 bg-white dark:bg-[#181818] border border-slate-200 dark:border-white/10 rounded-xl relative group">
                                            <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {/* Botón placeholder para desenrolar en el futuro */}
                                            </div>
                                            <Sprout className="w-6 h-6 text-emerald-500 dark:text-[#00ff9d] mb-2" />
                                            <p className="font-bold text-slate-900 dark:text-white truncate" title={ef.field?.name || fields.find(f => f.id === ef.field?.id)?.name}>
                                                {ef.field?.name || fields.find(f => f.id === ef.field?.id)?.name || 'Campo Inscrito'}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1 truncate">ID Lote: {ef.id.split('-')[0]}</p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <EditCampaignModal
                isOpen={isEditModalOpen}
                onClose={() => { setIsEditModalOpen(false); setCampaignToEdit(null); }}
                campaign={campaignToEdit}
                onSave={handleSaveCampaignEdit}
            />
        </div>
    );
}
