"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnalysisCanvasPanel,
  AnalysisErrorBanner,
  AnalysisHeader,
  BiosecurityCard,
  ImageBatchTabs,
  ModelFilterTabs,
  PredictionMetadataCard,
  RecipeSidebar,
  type AgronomicRecipe,
  type BatchInterpretation,
  type Detection,
  type ImageAnalysisEntry,
  type PerImageInterpretation,
} from "@/presentation/components/analysis";
import { AudioRecorder } from "@/presentation/components/analysis/AudioRecorder";
import { URL_BACKEND } from "@/shared/config/backend-url";
import { managementApi } from "@/lib/api/management.service";
import type { Campaign, Field, FieldCampaign } from "@/lib/api/management.types";
import { getToken } from "@/lib/auth-helpers";

function asText(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function parsePerImageInterpretation(value: unknown): PerImageInterpretation | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const item = value as Record<string, unknown>;
  const filename = asText(item.filename);
  if (!filename) return null;

  const targetPest = asText(item.targetPest ?? item.target_pest) ?? "Sin plaga detectada";
  const recipeRaw = item.recipe as Record<string, unknown> | undefined;
  const biosecurityRaw = item.biosecurity as Record<string, unknown> | undefined;

  const product = asText(recipeRaw?.product) ?? "No definido";
  const dose = asText(recipeRaw?.dose) ?? "No definido";
  const method = asText(recipeRaw?.method) ?? "No definido";

  // Accept both nested (biosecurity.status) and flat (biosecurityStatus) formats
  const status = asText(biosecurityRaw?.status) ?? asText(item.biosecurityStatus) ?? "VIGILANCIA";
  const protocol = asText(biosecurityRaw?.protocol) ?? asText(item.biosecurityProtocol) ?? "Protocolo estándar.";

  return {
    filename,
    targetPest,
    recipe: {
      product,
      dose,
      method,
    },
    biosecurityStatus: status.toUpperCase(),
    biosecurityProtocol: protocol,
  };
}

function parseBatchInterpretation(value: unknown): BatchInterpretation | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const raw = value as Record<string, unknown>;
  const generalSummary = asText(raw.generalSummary ?? raw.general_summary);
  if (!generalSummary) {
    return null;
  }

  const generalRecommendation = asText(raw.generalRecommendation ?? raw.general_recommendation) ?? "Sin recomendaciones específicas del lote.";
  const generalProduct = asText(raw.generalProduct ?? raw.general_product) ?? "No definido.";
  const generalOperativeGuide = asText(raw.generalOperativeGuide ?? raw.general_operative_guide) ?? "Monitoreo rutinario.";
  const generalBiosecurityProtocol = asText(raw.generalBiosecurityProtocol ?? raw.general_biosecurity_protocol) ?? "Protocolo estándar.";

  const perImageArray = Array.isArray(raw.perImage)
    ? raw.perImage
    : Array.isArray(raw.per_image)
      ? raw.per_image
      : [];

  const perImage = perImageArray
    .map(parsePerImageInterpretation)
    .filter((item): item is PerImageInterpretation => item !== null);

  return {
    generalSummary,
    generalRecommendation,
    generalProduct,
    generalOperativeGuide,
    generalBiosecurityProtocol,
    perImage,
  };
}

function getTopDetection(detections: Detection[]): Detection | null {
  return detections.reduce<Detection | null>(
    (best, current) => (!best || current.confidence > best.confidence ? current : best),
    null,
  );
}

function buildFallbackImageInterpretation(entry: {
  verified: boolean;
  verificationReason: string | null;
  detections: Detection[];
}): {
  targetPest: string;
  recipe: AgronomicRecipe;
  biosecurityStatus: string;
  biosecurityProtocol: string;
} {
  if (!entry.verified) {
    return {
      targetPest: "No aplicable",
      recipe: {
        product: "No aplica",
        dose: "No aplica",
        method:
          entry.verificationReason ??
          "Imagen fuera del dominio de inspeccion agrícola.",
      },
      biosecurityStatus: "RECHAZADA",
      biosecurityProtocol:
        entry.verificationReason ??
        "Solicitar una imagen valida (hoja, planta, trampa o contexto de inspeccion agrícola).",
    };
  }

  const topDetection = getTopDetection(entry.detections);
  if (!topDetection) {
    return {
      targetPest: "Sin plaga detectada",
      recipe: {
        product: "Monitoreo preventivo",
        dose: "No aplica",
        method:
          "Mantener monitoreo semanal, higiene del cultivo y seguimiento de focos tempranos.",
      },
      biosecurityStatus: "LIMPIO",
      biosecurityProtocol:
        "No se requieren medidas correctivas inmediatas. Continuar vigilancia rutinaria.",
    };
  }

  const status = topDetection.confidence >= 70 ? "ALTA PRIORIDAD" : "VIGILANCIA";
  return {
    targetPest: topDetection.pest,
    recipe: {
      product: `Control dirigido para ${topDetection.pest}`,
      dose: "Aplicar segun etiqueta tecnica y evaluacion en campo",
      method:
        "Aplicacion focalizada en zonas afectadas, retiro de tejido comprometido y re-evaluacion en 48-72 horas.",
    },
    biosecurityStatus: status,
    biosecurityProtocol:
      "Aislar focos activos, reforzar monitoreo y ajustar manejo fitosanitario segun evolucion del lote.",
  };
}

function buildFallbackGeneralSummary(entries: ImageAnalysisEntry[]): string {
  const rejected = entries.filter((entry) => !entry.verified).length;
  const withDetections = entries.filter((entry) => entry.verified && entry.detections.length > 0).length;
  const clean = entries.length - rejected - withDetections;

  return `Lote procesado: ${withDetections} imagenes con hallazgos, ${clean} sin plagas detectadas y ${rejected} rechazadas por verificacion.`;
}

export default function AnalysisPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [imageEntries, setImageEntries] = useState<ImageAnalysisEntry[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [globalSummary, setGlobalSummary] = useState<string | null>(null);
  const [globalBatchInterpretation, setGlobalBatchInterpretation] = useState<BatchInterpretation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [createdAnalysisId, setCreatedAnalysisId] = useState<string | null>(null);

  // Estados de Pre-Seleccion (Campaign y Field)
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");
  const [fields, setFields] = useState<Field[]>([]);
  const [enrolledFields, setEnrolledFields] = useState<FieldCampaign[]>([]);
  const [selectedFieldCampaignId, setSelectedFieldCampaignId] = useState<string>("");
  const [isManagementLoading, setIsManagementLoading] = useState(true);

  // Contexto Agronómico (pre-análisis)
  const [phenologicalState, setPhenologicalState] = useState("");
  const [soilQuality, setSoilQuality] = useState("");
  const [currentClimate, setCurrentClimate] = useState("");

  const [isReadyForAnalysis, setIsReadyForAnalysis] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageEntriesRef = useRef<ImageAnalysisEntry[]>([]);

  const selectedEntry = imageEntries[selectedImageIndex] ?? null;
  const selectedImage = selectedEntry?.previewUrl ?? null;
  const detections = selectedEntry?.detections ?? [];
  const availableModels = selectedEntry?.models ?? [];

  useEffect(() => {
    if (selectedImageIndex >= imageEntries.length && imageEntries.length > 0) {
      setSelectedImageIndex(0);
    }
  }, [imageEntries.length, selectedImageIndex]);

  useEffect(() => {
    setSelectedModels([]);
  }, [selectedImageIndex]);

  useEffect(() => {
    imageEntriesRef.current = imageEntries;
  }, [imageEntries]);

  useEffect(() => {
    return () => {
      imageEntriesRef.current.forEach((entry) => URL.revokeObjectURL(entry.previewUrl));
    };
  }, []);

  // UseEffect para fetchear Campanas 
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setIsManagementLoading(true);
        // PASO 0.1 (FRONTEND - ORIGEN DE DATOS): Carga inicial de Lotes
        // Al montar la página, el frontend le pide a la API REST de Gestión (managementApi)
        // los datos estructurados en PostgreSQL de Campañas y Campos disponibles para el usuario login.
        const fetchedCampaigns = await managementApi.getCampaigns();
        const fetchedFields = await managementApi.getFields();
        if (active) {
          const activeCampaigns = fetchedCampaigns.filter(c => c.isActive);
          setCampaigns(activeCampaigns);
          setFields(fetchedFields);
          if (activeCampaigns.length === 1) {
            setSelectedCampaignId(activeCampaigns[0].id);
          }
        }
      } catch (err) {
        console.error("Error cargando campañas y campos", err);
      } finally {
        if (active) setIsManagementLoading(false);
      }
    })();
    return () => { active = false; }
  }, []);

  // Lógica interactiva cuando se elige/cambia Campaña
  useEffect(() => {
    let active = true;
    if (selectedCampaignId) {
      // PASO 0.2 (FRONTEND - ORIGEN DE DATOS): Combobox Dinámico
      // Al escoger una Campaña en el UI, disparamos una consulta derivada a la API
      // para traer únicamente los Campos que estén inscritos en dicha Campaña.
      managementApi.getEnrolledFields(selectedCampaignId)
        .then(res => {
          if (active) setEnrolledFields(res);
        })
        .catch(err => console.error("Error obteniendo enrolled fields", err));
    } else {
      setEnrolledFields([]);
    }
    // Si cambia la campana (o el campo) reseteamos ready state
    setIsReadyForAnalysis(false);
    return () => { active = false; };
  }, [selectedCampaignId, selectedFieldCampaignId]);

  const addLog = (msg: string) => {
    setScanLogs((prev) => [...prev.slice(-4), msg]);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).filter((file) => file.type.startsWith("image/"));

    if (files.length > 0) {
      const entries: ImageAnalysisEntry[] = files.map((file, index) => ({
        id: `${file.name}-${file.lastModified}-${file.size}-${index}`,
        file,
        previewUrl: URL.createObjectURL(file),
        detections: [],
        models: [],
        verified: true,
        verificationReason: null,
        targetPest: null,
        recipe: null,
        biosecurityStatus: null,
        biosecurityProtocol: null,
      }));

      setImageEntries((prev) => {
        prev.forEach((entry) => URL.revokeObjectURL(entry.previewUrl));
        return entries;
      });
      setSelectedImageIndex(0);
      void performRealAnalysis(entries);
    }

    event.target.value = "";
  };

  const clearImageEntries = () => {
    setImageEntries((prev) => {
      prev.forEach((entry) => URL.revokeObjectURL(entry.previewUrl));
      return [];
    });
    setSelectedImageIndex(0);
    setSelectedModels([]);
    setGlobalSummary(null);
    setScanLogs([]);
    setError(null);
    setCreatedAnalysisId(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const performRealAnalysis = async (entries: ImageAnalysisEntry[]) => {
    if (entries.length === 0) return;

    setIsScanning(true);
    setScanLogs([]);
    setImageEntries((prev) =>
      prev.map((entry) => ({
        ...entry,
        detections: [],
        models: [],
        verified: true,
        verificationReason: null,
        targetPest: null,
        recipe: null,
        biosecurityStatus: null,
        biosecurityProtocol: null,
      })),
    );
    setSelectedModels([]);
    setGlobalSummary(null);
    setGlobalBatchInterpretation(null);
    setError(null);
    setCreatedAnalysisId(null);

    addLog("[SISTEMA] ACCEDIENDO AL NUCLEO NEURONAL PLAGACODE...");
    await new Promise((r) => setTimeout(r, 600));
    addLog("[BUFFER] AISLANDO CAMAS DE BIOMASA...");
    await new Promise((r) => setTimeout(r, 400));
    addLog("[ML] EJECUTANDO INFERENCIA MULTI-MODELO...");
    addLog(`[INGESTA] ${entries.length} IMAGENES EN COLA...`);

    // PASO 1 (FRONTEND): Preparar el paquete de datos (FormData)
    // Se empaquetan las imágenes en crudo que seleccionó el agricultor junto
    // con el contexto agronómico (clima, suelo, etapa fenológica) temporal para 
    // enviarlo todo estructurado hacia nuestro backend en Node.js.
    const formData = new FormData();
    entries.forEach((entry) => {
      formData.append("files", entry.file, entry.file.name);
    });
    formData.append("fieldCampaignId", selectedFieldCampaignId);
    if (phenologicalState.trim()) formData.append("phenologicalState", phenologicalState.trim());
    if (soilQuality.trim()) formData.append("soilQuality", soilQuality.trim());
    if (currentClimate.trim()) formData.append("currentClimate", currentClimate.trim());

    // PASO 2 (FRONTEND): Enviar la petición REST al Backend (Node.js)
    // Se adjunta el token JWT de seguridad del usuario logueado en las cabeceras
    // para cruzar nuestro Endpoint asegurado por el Guard allí.
    try {
      const token = getToken();
      const response = await fetch(`${URL_BACKEND}/pests/analyze/batch`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Fallo el analisis del backend");

      const data = await response.json();
      
      if (data.analysisId) {
        setCreatedAnalysisId(data.analysisId);
      }

      addLog("[BD] EMPAREJANDO ADN DEL PATOGENO...");
      await new Promise((r) => setTimeout(r, 800));

      const interpretation = parseBatchInterpretation(data.interpretation);
      const interpretationByFilename = new Map<string, PerImageInterpretation>();
      interpretation?.perImage.forEach((item) => {
        interpretationByFilename.set(item.filename.toLowerCase(), item);
      });

      const batchResults = Array.isArray(data.results) ? data.results : [];
      const parsedEntries = entries.map((entry, index) => {
        const result = batchResults[index] ?? {};
        const resultModels = Array.isArray(result.models)
          ? result.models.filter((m: unknown): m is string => typeof m === "string" && m.trim().length > 0)
          : [];

        const parsedDetections = Array.isArray(result.detections)
          ? result.detections.map(
            (d: {
              className?: string;
              class?: string;
              confidence: number;
              box: [number, number, number, number];
              model?: string | null;
            }) => ({
              pest: d.className ?? d.class ?? "desconocido",
              confidence: Math.round(d.confidence * 100),
              box: d.box,
              model: d.model ?? "modelo_desconocido",
            }),
          )
          : [];

        const verified = result.verified !== false;
        const verificationReason =
          typeof result.verificationReason === "string" && result.verificationReason.trim().length > 0
            ? result.verificationReason
            : null;

        const fallbackInterpretation = buildFallbackImageInterpretation({
          verified,
          verificationReason,
          detections: parsedDetections,
        });

        const interpretedEntry =
          interpretationByFilename.get(entry.file.name.toLowerCase()) ?? interpretation?.perImage[index] ?? null;

        return {
          ...entry,
          detections: parsedDetections,
          models:
            resultModels.length > 0
              ? resultModels
              : Array.from(new Set(parsedDetections.map((d: Detection) => d.model))),
          verified,
          verificationReason,
          targetPest: interpretedEntry?.targetPest ?? fallbackInterpretation.targetPest,
          recipe: interpretedEntry?.recipe ?? fallbackInterpretation.recipe,
          biosecurityStatus:
            interpretedEntry?.biosecurityStatus ?? fallbackInterpretation.biosecurityStatus,
          biosecurityProtocol:
            interpretedEntry?.biosecurityProtocol ?? fallbackInterpretation.biosecurityProtocol,
        } satisfies ImageAnalysisEntry;
      });

      setImageEntries(parsedEntries);
      setGlobalSummary(interpretation?.generalSummary ?? buildFallbackGeneralSummary(parsedEntries));
      setGlobalBatchInterpretation(interpretation ?? null);

      const totalDetections = parsedEntries.reduce((sum, entry) => sum + entry.detections.length, 0);
      const totalModels = parsedEntries.reduce((sum, entry) => sum + entry.models.length, 0);
      const rejectedCount = parsedEntries.filter((entry) => !entry.verified).length;

      if (totalDetections > 0) {
        addLog(`[RESULTADO] ${totalDetections} OBJETIVOS EN ${parsedEntries.length} IMAGENES.`);
      } else {
        addLog("[RESULTADO] ESTADO ESPECIMEN: SALUDABLE.");
      }

      if (rejectedCount > 0) {
        addLog(`[VERIFICACION] ${rejectedCount} IMAGENES RECHAZADAS.`);
      }

      addLog(`[MODELOS] ${totalModels} MODELOS TOTALES REPORTADOS.`);
      addLog("[PROTOCOLO] INTERPRETACION AGRONOMICA COMPLETADA.");
      await new Promise((r) => setTimeout(r, 400));
    } catch (err) {
      console.error("Analysis Error:", err);
      setError("Error conectando al enlace neural batch. Asegurese que el backend este activo.");
      addLog("[ERROR] ENLACE NEURAL DESCONECTADO.");
    } finally {
      setIsScanning(false);
    }
  };

  const modelNames =
    availableModels.length > 0 ? availableModels : Array.from(new Set(detections.map((d) => d.model)));

  const filteredDetections =
    selectedModels.length === 0
      ? detections
      : detections.filter((d) => selectedModels.includes(d.model));

  const formatModelName = (model: string) => {
    const lower = model.toLowerCase();

    if (lower === "yolov8m_v2_last") return "YOLOv8 Nano";

    if (lower.includes("v8n")) return "YOLOv8 Nano";
    if (lower.includes("v8m")) return "YOLOv8 Medium";
    if (lower.includes("yolo26")) return "YOLO26N";

    return model;
  };

  const activeFilterLabel = selectedModels.length === 0
    ? "TODOS"
    : Array.from(new Set(selectedModels.map(formatModelName))).join(" | ");

  const toggleModel = (model: string) => {
    setSelectedModels((prev) =>
      prev.includes(model) ? prev.filter((currentModel) => currentModel !== model) : [...prev, model],
    );
  };

  const primaryDetection = filteredDetections.reduce<Detection | null>(
    (best, current) => (!best || current.confidence > best.confidence ? current : best),
    null,
  );

  const selectedRecipe = selectedEntry?.recipe ?? null;
  const selectedTargetPest = selectedEntry?.targetPest ?? primaryDetection?.pest ?? null;
  const selectedBiosecurityStatus =
    selectedEntry?.biosecurityStatus ?? (primaryDetection ? "ALTA PRIORIDAD" : "LIMPIO");
  const selectedBiosecurityProtocol =
    selectedEntry?.biosecurityProtocol ??
    (primaryDetection
      ? "Las firmas neurales indican colonizacion activa de patogenos. Se recomienda mitigacion inmediata."
      : "Escaneo completo sin hallazgos de alta prioridad. Mantener vigilancia rutinaria.");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-white p-6 font-sans transition-colors duration-300">
      <AnalysisHeader />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
        {!isReadyForAnalysis && (
          <div className="lg:col-span-12 flex flex-col items-center justify-center min-h-[50vh]">
            <div className="bg-white dark:bg-white/5 p-8 rounded-3xl border border-gray-200 dark:border-white/10 shadow-lg w-full max-w-lg">
              <h2 className="text-xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100 uppercase tracking-wide">
                Configuración del Lote
              </h2>

              <div className="space-y-6">
                {/* Seleccion de Campana */}
                <div>
                  <label className="block text-xs font-mono text-gray-500 uppercase mb-2">
                    1. Seleccione Campaña
                  </label>
                  {isManagementLoading ? (
                    <div className="animate-pulse h-10 bg-gray-200 dark:bg-white/10 rounded-xl" />
                  ) : campaigns.length === 0 ? (
                    <div className="flex flex-col gap-3">
                      <div className="p-4 bg-orange-50 dark:bg-orange-500/10 border-l-4 border-orange-500 rounded text-sm text-orange-700 dark:text-orange-300">
                        No dispone de campañas activas. Vaya al mantenedor de Campañas para crear una.
                      </div>
                      <a href="/settings" className="w-auto px-4 py-2 border border-[#ff003c] text-[#ff003c] text-xs font-bold rounded-lg hover:bg-[#ff003c] hover:text-white transition-colors self-start text-center">
                        Crear Campaña en Ajustes
                      </a>
                    </div>
                  ) : (
                    <select
                      value={selectedCampaignId}
                      onChange={(e) => {
                        setSelectedCampaignId(e.target.value);
                        setSelectedFieldCampaignId(""); // reset
                      }}
                      className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
                    >
                      <option value="" disabled>-- Escoja una campaña activa --</option>
                      {campaigns.map(c => (
                        <option key={c.id} value={c.id}>
                          Campaña {new Date(c.startDate).toLocaleDateString()} - {new Date(c.endDate).toLocaleDateString()} (Activa)
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Seleccion de Campo Inscrito */}
                {selectedCampaignId && (
                  <div>
                    <label className="block text-xs font-mono text-gray-500 uppercase mb-2">
                      2. Seleccione Campo a Escanear
                    </label>
                    {isManagementLoading ? (
                      <div className="animate-pulse h-10 bg-gray-200 dark:bg-white/10 rounded-xl" />
                    ) : enrolledFields.length === 0 ? (
                      <div className="flex flex-col gap-3">
                        <div className="p-4 bg-orange-50 dark:bg-orange-500/10 border-l-4 border-orange-500 rounded text-sm text-orange-700 dark:text-orange-300">
                          No hay campos inscritos en esta campaña. Vaya al mantenedor o inscriba uno.
                        </div>
                        <a href="/settings" className="w-auto px-4 py-2 border border-[#00ff9d] text-[#00ff9d] text-xs font-bold rounded-lg hover:bg-[#00ff9d] hover:text-black transition-colors self-start text-center">
                          Inscribir Campo en Ajustes
                        </a>
                      </div>
                    ) : (
                      <select
                        value={selectedFieldCampaignId}
                        onChange={(e) => setSelectedFieldCampaignId(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#ff003c] outline-none transition-all dark:text-white"
                      >
                        <option value="" disabled>-- Escoja el campo inscrito --</option>
                        {enrolledFields.map(ef => (
                          <option key={ef.id} value={ef.id}>
                            {ef.field.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}

                {/* Contexto Agronómico */}
                {selectedFieldCampaignId && (
                  <div className="space-y-3 pt-2 border-t border-gray-200 dark:border-white/10">
                    <label className="block text-xs font-mono text-gray-500 uppercase mb-1">
                      3. Contexto Agronómico (opcional, mejora recomendaciones IA)
                    </label>
                    <div>
                      {/* PASO 0.3 (FRONTEND - ORIGEN DE DATOS): Contextos estáticos y libres */}
                      {/* El "Estado Fenológico" es un desplegable hardcodeado en el código fuente de React, */}
                      {/* mientras que el Suelo y Clima nacen del tipeo manual y libre del agricultor en TxtArea. */}
                      <label className="block text-[11px] text-gray-500 dark:text-gray-400 mb-1">Estado Fenológico</label>
                      <select
                        value={phenologicalState}
                        onChange={(e) => setPhenologicalState(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white"
                      >
                        <option value="">-- Sin especificar --</option>
                        <option value="Germinación">Germinación</option>
                        <option value="Plántula">Plántula</option>
                        <option value="Vegetativo">Vegetativo</option>
                        <option value="Floración">Floración</option>
                        <option value="Fructificación">Fructificación</option>
                        <option value="Maduración">Maduración</option>
                        <option value="Cosecha">Cosecha</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-500 dark:text-gray-400 mb-1">Calidad del Suelo Actual</label>
                      <textarea
                        value={soilQuality}
                        onChange={(e) => setSoilQuality(e.target.value)}
                        placeholder="Ej. Suelo franco-arcilloso, pH 6.5, buena retención de humedad"
                        rows={2}
                        className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-500 dark:text-gray-400 mb-1">Clima Actual</label>
                      <textarea
                        value={currentClimate}
                        onChange={(e) => setCurrentClimate(e.target.value)}
                        placeholder="Ej. Temp. 28°C, humedad relativa 75%, lluvias intermitentes"
                        rows={2}
                        className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none dark:text-white"
                      />
                    </div>
                  </div>
                )}

                {/* Confirmación */}
                {selectedFieldCampaignId && (
                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={() => setIsReadyForAnalysis(true)}
                      className="px-6 py-3 bg-emerald-600 dark:bg-[#00ff9d] text-white dark:text-black font-bold text-sm rounded-xl hover:bg-emerald-700 dark:hover:bg-[#00cc7d] transition-colors shadow-lg shadow-emerald-500/20 dark:shadow-[#00ff9d]/20"
                    >
                      Confirmar Configuración y Continuar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {isReadyForAnalysis && (
          <>
            {/* === SECCIÓN FULL-WIDTH (12 cols) === */}
            {/* Filtro de Modelos - full width */}
            <div className="lg:col-span-12">
              <ModelFilterTabs
                modelNames={modelNames}
                selectedModels={selectedModels}
                activeFilterLabel={activeFilterLabel}
                onSelectAll={() => setSelectedModels([])}
                onToggleModel={toggleModel}
              />
            </div>

            {/* Lote de Imagenes - full width */}
            {imageEntries.length > 0 && (
              <div className="lg:col-span-12">
                <ImageBatchTabs
                  imageEntries={imageEntries}
                  selectedImageIndex={selectedImageIndex}
                  onSelectImage={setSelectedImageIndex}
                />
              </div>
            )}

            {/* === SECCIÓN DIVIDIDA: Canvas (8 cols) + Sidebar (4 cols) === */}
            <main className="lg:col-span-8 flex flex-col gap-6">
              <AnalysisCanvasPanel
                selectedImage={selectedImage}
                selectedEntry={selectedEntry}
                detections={detections}
                filteredDetections={filteredDetections}
                isScanning={isScanning}
                scanLogs={scanLogs}
                imageEntriesCount={imageEntries.length}
                fileInputRef={fileInputRef}
                onUploadChange={handleImageUpload}
                onClearImageEntries={clearImageEntries}
                onReprocess={() => {
                  if (imageEntries.length > 0) {
                    void performRealAnalysis(imageEntries);
                  }
                }}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PredictionMetadataCard
                  modelNames={modelNames}
                  activeFilterLabel={activeFilterLabel}
                  selectedEntry={selectedEntry}
                  filteredDetections={filteredDetections}
                />
                <BiosecurityCard
                  status={selectedBiosecurityStatus}
                  protocol={selectedBiosecurityProtocol}
                />
              </div>
              
              {createdAnalysisId && (
                <div className="mt-2">
                  <AudioRecorder analysisId={createdAnalysisId} />
                </div>
              )}
            </main>

            <RecipeSidebar
              recipe={selectedRecipe}
              primaryDetection={primaryDetection}
              targetPest={selectedTargetPest}
              imageEntries={imageEntries}
              batchInterpretation={globalBatchInterpretation}
              agronomicContext={
                phenologicalState || soilQuality || currentClimate
                  ? {
                      phenologicalState: phenologicalState || null,
                      soilQuality: soilQuality || null,
                      currentClimate: currentClimate || null,
                    }
                  : null
              }
              isInfected={imageEntries.some(
                (e) => e.verified && e.detections.length > 0
              )}
              bugDensity={imageEntries.reduce(
                (sum, e) => sum + e.detections.length,
                0
              )}
              fieldName={
                enrolledFields.find((ef) => ef.id === selectedFieldCampaignId)
                  ?.field?.name ?? null
              }
            />

            {/* === RESUMEN GENERAL DEL LOTE (full width, al final) === */}
            {globalBatchInterpretation && globalSummary && (
              <div className="lg:col-span-12 p-6 rounded-3xl border border-emerald-300/30 bg-emerald-50/80 dark:bg-[#00ff9d]/5 dark:border-[#00ff9d]/20">
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-700 dark:text-[#00ff9d] mb-2 font-bold">
                  Resumen General del Lote
                </p>
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-200 mb-4">{globalSummary}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-3 rounded-xl bg-white/60 dark:bg-white/5 border border-emerald-200/50 dark:border-emerald-800/30">
                    <p className="text-[9px] font-mono uppercase text-emerald-600 dark:text-emerald-400 mb-1">Recomendacion General</p>
                    <p className="text-[11px] text-gray-700 dark:text-gray-200">{globalBatchInterpretation.generalRecommendation}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/60 dark:bg-white/5 border border-emerald-200/50 dark:border-emerald-800/30">
                    <p className="text-[9px] font-mono uppercase text-emerald-600 dark:text-emerald-400 mb-1">Producto General</p>
                    <p className="text-[11px] text-gray-700 dark:text-gray-200 font-bold">{globalBatchInterpretation.generalProduct}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/60 dark:bg-white/5 border border-emerald-200/50 dark:border-emerald-800/30">
                    <p className="text-[9px] font-mono uppercase text-emerald-600 dark:text-emerald-400 mb-1">Guia Operativa Global</p>
                    <p className="text-[11px] text-gray-700 dark:text-gray-200 italic">{globalBatchInterpretation.generalOperativeGuide}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/60 dark:bg-white/5 border border-red-200/50 dark:border-red-800/30">
                    <p className="text-[9px] font-mono uppercase text-red-600 dark:text-red-400 mb-1">Protocolo Bioseguridad del Lote</p>
                    <p className="text-[11px] text-gray-700 dark:text-gray-200 italic">{globalBatchInterpretation.generalBiosecurityProtocol}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <AnalysisErrorBanner error={error} onClose={() => setError(null)} />
    </div >
  );
}
