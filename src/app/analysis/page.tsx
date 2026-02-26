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
  RECIPES,
  RecipeSidebar,
  type AgronomicRecipe,
  type Detection,
  type ImageAnalysisEntry,
} from "@/presentation/components/analysis";
import { URL_BACKEND } from "@/shared/config/backend-url";

export default function AnalysisPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [imageEntries, setImageEntries] = useState<ImageAnalysisEntry[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

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
    setScanLogs([]);
    setError(null);

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
      })),
    );
    setSelectedModels([]);
    setError(null);

    addLog("[SISTEMA] ACCEDIENDO AL NUCLEO NEURONAL TOMATOCODE...");
    await new Promise((r) => setTimeout(r, 600));
    addLog("[BUFFER] AISLANDO CAMAS DE BIOMASA...");
    await new Promise((r) => setTimeout(r, 400));
    addLog("[ML] EJECUTANDO INFERENCIA MULTI-MODELO...");
    addLog(`[INGESTA] ${entries.length} IMAGENES EN COLA...`);

    const formData = new FormData();
    entries.forEach((entry) => {
      formData.append("files", entry.file, entry.file.name);
    });

    try {
      const response = await fetch(`${URL_BACKEND}/pests/analyze/batch`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Fallo el analisis del backend");

      const data = await response.json();

      addLog("[BD] EMPAREJANDO ADN DEL PATOGENO...");
      await new Promise((r) => setTimeout(r, 800));

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

        return {
          ...entry,
          detections: parsedDetections,
          models:
            resultModels.length > 0
              ? resultModels
              : Array.from(new Set(parsedDetections.map((d: Detection) => d.model))),
          verified: result.verified !== false,
          verificationReason:
            typeof result.verificationReason === "string" && result.verificationReason.trim().length > 0
              ? result.verificationReason
              : null,
        };
      });

      setImageEntries(parsedEntries);

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
      addLog("[PROTOCOLO] RECETA AGRICOLA AISLADA.");
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

  const activeFilterLabel = selectedModels.length === 0 ? "TODOS" : selectedModels.join(" | ");

  const toggleModel = (model: string) => {
    setSelectedModels((prev) =>
      prev.includes(model) ? prev.filter((currentModel) => currentModel !== model) : [...prev, model],
    );
  };

  const primaryDetection = filteredDetections.reduce<Detection | null>(
    (best, current) => (!best || current.confidence > best.confidence ? current : best),
    null,
  );

  const getRecipe = (pest: string): AgronomicRecipe => {
    const key = Object.keys(RECIPES).find((recipeKey) => recipeKey.toLowerCase() === pest.toLowerCase());
    return key ? RECIPES[key] : RECIPES.Saludable;
  };

  const recipe = primaryDetection ? getRecipe(primaryDetection.pest) : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-white p-6 font-sans transition-colors duration-300">
      <AnalysisHeader />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
        <main className="lg:col-span-8 flex flex-col gap-6">
          <ModelFilterTabs
            modelNames={modelNames}
            selectedModels={selectedModels}
            activeFilterLabel={activeFilterLabel}
            onSelectAll={() => setSelectedModels([])}
            onToggleModel={toggleModel}
          />

          <ImageBatchTabs
            imageEntries={imageEntries}
            selectedImageIndex={selectedImageIndex}
            onSelectImage={setSelectedImageIndex}
          />

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
            <BiosecurityCard primaryDetection={primaryDetection} />
          </div>
        </main>

        <RecipeSidebar recipe={recipe} primaryDetection={primaryDetection} />
      </div>

      <AnalysisErrorBanner error={error} onClose={() => setError(null)} />
    </div>
  );
}
