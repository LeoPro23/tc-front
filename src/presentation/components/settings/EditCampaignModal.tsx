import React, { useState } from 'react';
import { Loader2, X, Calendar } from 'lucide-react';
import type { Campaign } from '@/lib/api/management.types';

interface EditCampaignModalProps {
    isOpen: boolean;
    onClose: () => void;
    campaign: Campaign | null;
    onSave: (id: string, newStart: string, newEnd: string) => Promise<void>;
}

export function EditCampaignModal({ isOpen, onClose, campaign, onSave }: EditCampaignModalProps) {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Sync state when campaign changes
    React.useEffect(() => {
        if (campaign) {
            const formatLocalDate = (isoString: string) => {
                if (!isoString) return '';
                const date = new Date(isoString);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };
            setStartDate(formatLocalDate(campaign.startDate));
            setEndDate(formatLocalDate(campaign.endDate));
        }
    }, [campaign]);

    if (!isOpen || !campaign) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await onSave(
                campaign.id,
                new Date(startDate + 'T12:00:00').toISOString(),
                new Date(endDate + 'T12:00:00').toISOString()
            );
            onClose();
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#0d0d0d] rounded-xl shadow-xl border border-slate-200 dark:border-white/10 w-full max-w-md overflow-hidden relative">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10">
                    <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                        <Calendar className="w-5 h-5 text-emerald-500" />
                        Editar Campaña
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors text-slate-500"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-500 mb-1">Nueva Fecha de Inicio</label>
                        <input
                            type="date"
                            required
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-[#111] border border-slate-200 dark:border-white/10 rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-emerald-500 dark:text-white dark:[color-scheme:dark]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-500 mb-1">Nueva Fecha de Fin</label>
                        <input
                            type="date"
                            required
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-[#111] border border-slate-200 dark:border-white/10 rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-emerald-500 dark:text-white dark:[color-scheme:dark]"
                        />
                    </div>

                    {/* Footer / Actions */}
                    <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-[#00ff9d] dark:hover:bg-[#00cc7d] dark:text-black text-white font-bold text-sm rounded-lg flex items-center justify-center gap-2 min-w-[120px] disabled:opacity-50 transition-colors"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
