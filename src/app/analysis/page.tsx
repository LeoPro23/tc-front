"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NextImage from "next/image";
import {
  Upload,
  Search,
  Target,
  ShieldAlert,
  Cpu,
  Dna,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Leaf,
  Thermometer,
} from "lucide-react";
import Link from "next/link";

interface Detection {
  pest: string;
  confidence: number;
  box: [number, number, number, number];
}

interface AgronomicRecipe {
  product: string;
  dose: string;
  method: string;
}

const RECIPES: Record<string, AgronomicRecipe> = {
  "Tuta absoluta": {
    product: "Clorantraniliprol (Coragen)",
    dose: "150-200 ml/ha",
    method: "Aplicación foliar y control biológico (Nesidiocoris)",
  },
  "Mosca blanca": {
    product: "Imidacloprid / Thiamethoxam",
    dose: "0.5 L/ha",
    method: "Trampas cromáticas amarillas y control químico suave",
  },
  Minador: {
    product: "Abamectina",
    dose: "0.75 - 1.0 L/ha",
    method: "Eliminación de brotes dañados y aplicación dirigida",
  },
  Healthy: {
    product: "N/A",
    dose: "N/A",
    method: "Mantener ciclos de riego y fertilización estándar",
  },
};

export default function AnalysisPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        performRealAnalysis(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const addLog = (msg: string) => {
    setScanLogs((prev) => [...prev.slice(-4), msg]);
  };

  const performRealAnalysis = async (file: File) => {
    setIsScanning(true);
    setScanLogs([]);
    setDetections([]);
    setError(null);

    // Sequence for "Wow" Factor
    addLog("[SYSTEM] ACCESSING CROPINTEL NEURAL CORE...");
    await new Promise((r) => setTimeout(r, 600));
    addLog("[BUFFER] ISOLATING BEDS OF BIOMASS...");
    await new Promise((r) => setTimeout(r, 400));
    addLog("[ML] RUNNING YOLOv11x-AGRI SURVEILLANCE...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:3100/pests/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Backend analysis failed");

      const data = await response.json();

      addLog("[DATABASE] MATCHING PATHOGEN DNA...");
      await new Promise((r) => setTimeout(r, 800));

      if (data.detections && data.detections.length > 0) {
        setDetections(
          data.detections.map(
            (d: {
              className: string;
              confidence: number;
              box: [number, number, number, number];
            }) => ({
              pest: d.className,
              confidence: Math.round(d.confidence * 100),
              box: d.box,
            }),
          ),
        );
        addLog(`[RESULT] ${data.detections.length} TARGETS IDENTIFIED.`);
      } else {
        setDetections([]);
        addLog("[RESULT] SPECIMEN STATUS: HEALTHY.");
      }
      addLog("[PROTOCOL] AGRI-RECIPE ISOLATED.");
      await new Promise((r) => setTimeout(r, 400));
    } catch (err) {
      console.error("Analysis Error:", err);
      setError("Error connecting to neural link. Ensure backend is active.");
      addLog("[ERROR] NEURAL LINK DISCONNECTED.");
    } finally {
      setIsScanning(false);
    }
  };

  const primaryDetection = detections[0] || null;

  // Case-insensitive lookup for recipes
  const getRecipe = (pest: string) => {
    const key = Object.keys(RECIPES).find(
      (k) => k.toLowerCase() === pest.toLowerCase(),
    );
    return key ? RECIPES[key] : RECIPES["Healthy"];
  };

  const recipe = primaryDetection ? getRecipe(primaryDetection.pest) : null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 font-sans selection:bg-[#00ff9d]/30">
      {/* Header */}
      <header className="flex items-center justify-between mb-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all group"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 shadow-[0_0_15px_rgba(0,255,157,0.1)]">
              <Dna className="w-6 h-6 text-[#00ff9d]" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tighter uppercase italic">
                CROP<span className="text-[#00ff9d]">INTEL</span>{" "}
                <span className="text-gray-500 not-italic font-normal">
                  v4.0
                </span>
              </h1>
              <div className="flex items-center gap-2">
                <Leaf className="w-3 h-3 text-[#00ff9d]/50" />
                <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-mono">
                  Neural Pathogen Diagnosis
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:block text-right">
            <div className="flex items-center gap-2 justify-end">
              <span className="w-1.5 h-1.5 bg-[#00ff9d] rounded-full animate-pulse shadow-[0_0_5px_#00ff9d]"></span>
              <p className="text-[10px] font-mono text-emerald-400">
                ML-CORE READY
              </p>
            </div>
            <p className="text-[9px] text-gray-600 font-mono">LATENCY: 42ms</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
        {/* Main Analysis Area */}
        <main className="lg:col-span-8 flex flex-col gap-6">
          <div className="glass-panel rounded-3xl overflow-hidden relative aspect-video flex items-center justify-center border border-white/5 bg-black/40 group">
            <AnimatePresence mode="wait">
              {!selectedImage ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="flex flex-col items-center text-center p-12 cursor-pointer w-full h-full justify-center"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-[#00ff9d]/20 blur-3xl rounded-full"></div>
                    <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative z-10 group-hover:border-[#00ff9d]/50 transition-colors">
                      <Upload className="w-10 h-10 text-[#00ff9d] animate-bounce" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-2">
                    Initialize Sample Scan
                  </h2>
                  <p className="text-gray-500 max-w-sm mb-8 text-sm font-medium">
                    Upload hyperspectral leaf imagery for deep neural processing
                    and pathogen identification.
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="h-[1px] w-8 bg-white/10"></div>
                    <span className="text-[10px] font-mono text-gray-600 tracking-widest uppercase">
                      Select Source
                    </span>
                    <div className="h-[1px] w-8 bg-white/10"></div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative w-full h-full flex items-center justify-center bg-black/60"
                >
                  <div className="relative w-full h-full">
                    <NextImage
                      src={selectedImage}
                      alt="Sample"
                      fill
                      className={`object-contain transition-all duration-700 ${isScanning ? "brightness-75 contrast-125 saturate-[1.2] hue-rotate-[90deg]" : "brightness-100"}`}
                      unoptimized={selectedImage.startsWith("blob:")}
                    />
                  </div>

                  {/* Scanning Laser Line */}
                  <AnimatePresence>
                    {isScanning && (
                      <>
                        <motion.div
                          initial={{ top: "-10%" }}
                          animate={{ top: "110%" }}
                          transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00ff9d] to-transparent shadow-[0_0_20px_#00ff9d] z-20"
                        />
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
                        <motion.div
                          animate={{ opacity: [0.3, 0.6, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="absolute inset-0 border-[20px] border-[#00ff9d]/5 pointer-events-none"
                        ></motion.div>
                      </>
                    )}
                  </AnimatePresence>

                  {/* Scanning HUD Overlay - CINEMATIC VERSION */}
                  <AnimatePresence>
                    {isScanning && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-40 bg-black/40 backdrop-blur-[2px] overflow-hidden flex items-center justify-center"
                      >
                        {/* Digital Grid Background */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00ff9d0d_1px,transparent_1px),linear-gradient(to_bottom,#00ff9d0d_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

                        {/* CENTRAL NEURAL CORE LOADER */}
                        <div className="relative w-64 h-64 flex items-center justify-center">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 10,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="absolute inset-0 border-2 border-dashed border-[#00ff9d]/20 rounded-full"
                          />
                          <motion.div
                            animate={{
                              scale: [1, 1.1, 1],
                              opacity: [0.1, 0.4, 0.1],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-4 border-4 border-[#00ff9d] rounded-full shadow-[0_0_30px_#00ff9d]"
                          />
                          <motion.div
                            animate={{ rotate: -360 }}
                            transition={{
                              duration: 5,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="absolute inset-10 border border-[#00ff9d]/40 rounded-full border-t-transparent"
                          />
                          <div className="flex flex-col items-center z-10">
                            <Dna className="w-12 h-12 text-[#00ff9d] animate-pulse mb-3" />
                            <span className="text-[10px] font-mono text-[#00ff9d] font-black tracking-[0.4em] animate-pulse">
                              SCANNING...
                            </span>
                          </div>
                        </div>

                        {/* Scanning Laser HUD */}
                        <motion.div
                          animate={{ top: ["10%", "90%"] }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="absolute left-0 w-full h-[2px] bg-[#00ff9d] shadow-[0_0_25px_5px_#00ff9d] z-50"
                        >
                          <div className="absolute top-0 right-4 transform -translate-y-full text-[8px] font-mono text-[#00ff9d] animate-pulse">
                            SCANNING_SURFACE_DNA...
                          </div>
                        </motion.div>

                        {/* Floating Tech Corners */}
                        <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none">
                          <div className="flex justify-between">
                            <div className="w-12 h-12 border-t-2 border-l-2 border-[#00ff9d]"></div>
                            <div className="w-12 h-12 border-t-2 border-r-2 border-[#00ff9d]"></div>
                          </div>
                          <div className="flex justify-between">
                            <div className="w-12 h-12 border-b-2 border-l-2 border-[#00ff9d]"></div>
                            <div className="w-12 h-12 border-b-2 border-r-2 border-[#00ff9d]"></div>
                          </div>
                        </div>

                        {/* Terminal Logs - High Tech Style */}
                        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-xl group">
                          <div className="bg-black/90 border-2 border-[#00ff9d]/30 rounded-2xl p-6 font-mono text-[11px] uppercase tracking-widest text-[#00ff9d] shadow-[0_0_50px_rgba(0,255,157,0.2)]">
                            <div className="flex items-center justify-between mb-4 border-b border-[#00ff9d]/20 pb-3">
                              <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 bg-[#00ff9d] rounded-full animate-ping"></div>
                                <span className="font-black italic">
                                  ML-AGRI NEURAL CORE // v4.0.2
                                </span>
                              </div>
                              <div className="flex gap-1">
                                <div className="w-4 h-1 bg-[#00ff9d]"></div>
                                <div className="w-1 h-1 bg-[#00ff9d]/30"></div>
                              </div>
                            </div>
                            <div className="space-y-2 h-24 overflow-hidden">
                              {scanLogs.map((log, i) => (
                                <motion.p
                                  key={i}
                                  initial={{ x: -20, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  className="flex items-center gap-3"
                                >
                                  <span className="text-[#00ff9d]/40">
                                    [
                                    {new Date().toLocaleTimeString("en-US", {
                                      hour12: false,
                                      minute: "2-digit",
                                      second: "2-digit",
                                    })}
                                    ]
                                  </span>
                                  <span className="text-white brightness-125 font-bold">
                                    {log}
                                  </span>
                                </motion.p>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Tech HUD Bounding Boxes */}
                  {!isScanning &&
                    detections.map((det, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                        className="absolute border-2 border-[#ff003c] rounded-lg shadow-[0_0_30px_rgba(255,0,60,0.4)] z-30 pointer-events-none group/box"
                        style={{
                          left: `${(det.box[0] / 640) * 100}%`,
                          top: `${(det.box[1] / 640) * 100}%`,
                          width: `${((det.box[2] - det.box[0]) / 640) * 100}%`,
                          height: `${((det.box[3] - det.box[1]) / 640) * 100}%`,
                        }}
                      >
                        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white -translate-x-1 -translate-y-1"></div>
                        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white translate-x-1 -translate-y-1"></div>
                        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white -translate-x-1 translate-y-1"></div>
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white translate-x-1 translate-y-1"></div>

                        <div className="absolute -top-10 left-0 flex flex-col gap-1 drop-shadow-2xl">
                          <div className="px-3 py-1 bg-[#ff003c] text-white text-[10px] font-black uppercase tracking-tighter italic flex items-center gap-2 rounded-t-md border-b-2 border-black/20">
                            <Target className="w-3.5 h-3.5" /> {det.pest}
                          </div>
                          <div className="bg-white text-black text-[9px] font-black px-2 py-0.5 rounded-b-md flex justify-between gap-4">
                            <span>CONFIDENCE</span>
                            <span>{det.confidence}%</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                  {/* Clean Specimen Post-Scan UI */}
                  {!isScanning && selectedImage && detections.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-[#00ff9d]/10 backdrop-blur-xl border-2 border-[#00ff9d]/50 px-10 py-6 rounded-3xl z-40 shadow-[0_0_40px_rgba(0,255,157,0.2)]"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <ShieldCheck className="w-12 h-12 text-[#00ff9d] mb-2" />
                        <h2 className="text-2xl font-black italic tracking-tighter text-white uppercase">
                          HEALTHY BIOMASS
                        </h2>
                        <p className="text-[#00ff9d] text-[10px] font-mono tracking-widest font-black">
                          NO PATHOGEN SIGNATURES FOUND
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Post-Scan Overlay Info */}
                  {!isScanning && detections.length > 0 && (
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <div className="px-3 py-1.5 bg-black/80 backdrop-blur-md rounded-lg border border-white/10 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#ff003c] animate-pulse"></div>
                        <span className="text-[10px] font-mono font-bold uppercase text-white">
                          {" "}
                          Threat Identified{" "}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Controls */}
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center pointer-events-none">
                    <div className="flex gap-2 pointer-events-auto">
                      <button
                        onClick={() => setSelectedImage(null)}
                        className="p-3 bg-black/60 backdrop-blur-xl rounded-xl border border-white/10 hover:bg-white/10 transition-all group"
                      >
                        <Upload className="w-5 h-5 text-gray-500 group-hover:text-white" />
                      </button>
                    </div>
                    {!isScanning && (
                      <button
                        onClick={() =>
                          imageFile && performRealAnalysis(imageFile)
                        }
                        className="px-6 py-3 bg-[#00ff9d]/20 backdrop-blur-xl rounded-xl border border-[#00ff9d]/30 text-[#00ff9d] text-xs font-black italic tracking-widest flex items-center gap-3 pointer-events-auto hover:bg-[#00ff9d]/30 transition-all shadow-[0_0_20px_rgba(0,255,157,0.1)]"
                      >
                        <Search className="w-4 h-4" /> RE-PROCESS NEURAL LINK
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
              accept="image/*"
            />
          </div>

          {/* Analysis Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col justify-between group overflow-hidden relative">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#00ff9d]/5 rounded-full blur-2xl group-hover:bg-[#00ff9d]/10 transition-colors"></div>
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                    <Target className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-black italic text-xs text-gray-300 uppercase tracking-widest">
                      Prediction Metadata
                    </h3>
                    <p className="text-[10px] text-gray-500 font-mono">
                      MODEL: YOLOv11x-AGRI
                    </p>
                  </div>
                </div>
                <div className="space-y-3 font-mono">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-gray-600 uppercase">
                      Detection Count
                    </span>
                    <span className="text-white font-bold">
                      {detections.length} Targets
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] pt-3 border-t border-white/5">
                    <span className="text-gray-600 uppercase flex items-center gap-1">
                      <Thermometer className="w-3 h-3 text-[#00ff9d]" />{" "}
                      Bio-Thermal Reading
                    </span>
                    <span className="text-white font-bold">
                      98.6°F // STABLE
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-white/5 border-l-[#ff003c] border-l-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2.5 bg-[#ff003c]/10 rounded-xl border border-[#ff003c]/20">
                  <ShieldAlert className="w-5 h-5 text-[#ff003c]" />
                </div>
                <div>
                  <h3 className="font-black italic text-xs text-gray-300 uppercase tracking-widest">
                    Biosecurity Protocol
                  </h3>
                  <p className="text-[10px] text-gray-500 font-mono">
                    STATUS: {primaryDetection ? "HIGH PRIORITY" : "CLEAR"}
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed italic">
                {primaryDetection
                  ? "Neural signatures indicate active pathogen colonization. Immediate mitigation sequences are required to preserve biomass integrity."
                  : "Scanning complete. No pathogenic phenotypic variants identified in current sample buffer."}
              </p>
            </div>
          </div>
        </main>

        {/* Sidebar - Agronomic Recipe */}
        <aside className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-panel p-8 rounded-[2rem] border border-white/5 flex flex-col h-full bg-gradient-to-b from-black/40 to-transparent">
            <h2 className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
              <span className="w-2 h-2 bg-[#00ff9d] rounded-full"></span>{" "}
              AGRI-RECIPE LOG
            </h2>

            <AnimatePresence mode="wait">
              {recipe ? (
                <motion.div
                  key={primaryDetection?.pest}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.15 },
                    },
                  }}
                  className="space-y-8"
                >
                  <motion.div
                    variants={{
                      hidden: { y: 20, opacity: 0 },
                      visible: { y: 0, opacity: 1 },
                    }}
                  >
                    <p className="text-[10px] font-mono text-gray-600 uppercase mb-2">
                      Target Pathogen
                    </p>
                    <div className="flex items-center gap-4">
                      <h3 className="text-4xl font-black italic tracking-tighter text-white uppercase drop-shadow-[0_0_20px_#ff003c44]">
                        {primaryDetection?.pest}
                      </h3>
                      <div className="px-3 py-1 bg-[#ff003c] text-white text-[10px] font-black rounded border-2 border-white/10 shadow-[0_0_15px_#ff003c]">
                        POS
                      </div>
                    </div>
                  </motion.div>

                  <div className="space-y-6">
                    <motion.div
                      variants={{
                        hidden: { x: 20, opacity: 0 },
                        visible: { x: 0, opacity: 1 },
                      }}
                      className="group relative"
                    >
                      <div className="absolute -inset-1 bg-gradient-to-r from-[#FFA500]/20 to-transparent rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                      <div className="relative p-6 bg-white/5 rounded-3xl border border-white/5 group-hover:border-[#FFA500]/40 transition-all duration-300">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="p-3 bg-[#FFA500]/10 rounded-2xl">
                            <Zap className="w-5 h-5 text-[#FFA500]" />
                          </div>
                          <p className="text-[11px] font-mono text-gray-500 uppercase tracking-widest">
                            Recommended Product
                          </p>
                        </div>
                        <p className="text-xl font-black text-white leading-tight italic">
                          {recipe.product}
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      variants={{
                        hidden: { x: 20, opacity: 0 },
                        visible: { x: 0, opacity: 1 },
                      }}
                      className="group relative"
                    >
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-transparent rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                      <div className="relative p-6 bg-white/5 rounded-3xl border border-white/5 group-hover:border-blue-400/40 transition-all duration-300">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="p-3 bg-blue-500/10 rounded-2xl">
                            <TrendingUp className="w-5 h-5 text-blue-400" />
                          </div>
                          <p className="text-[11px] font-mono text-gray-500 uppercase tracking-widest">
                            Application Dosage
                          </p>
                        </div>
                        <p className="text-xl font-black text-white leading-tight italic">
                          {recipe.dose}
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      variants={{
                        hidden: { x: 20, opacity: 0 },
                        visible: { x: 0, opacity: 1 },
                      }}
                      className="relative p-6 bg-[#00ff9d]/5 rounded-3xl border-2 border-[#00ff9d]/20 shadow-[0_0_30px_#00ff9d0a] overflow-hidden group"
                    >
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
                        <ShieldCheck className="w-16 h-16 text-[#00ff9d]" />
                      </div>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-[#00ff9d]/20 rounded-2xl shadow-[0_0_15px_#00ff9d22]">
                          <ShieldCheck className="w-5 h-5 text-[#00ff9d]" />
                        </div>
                        <p className="text-[11px] font-mono text-[#00ff9d] uppercase font-black tracking-widest">
                          Operational Guidance
                        </p>
                      </div>
                      <p className="text-sm text-emerald-100/80 leading-relaxed font-bold italic relative z-10">
                        {recipe.method}
                      </p>
                    </motion.div>
                  </div>

                  <motion.div
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: 1 },
                    }}
                    className="pt-8 border-t border-white/5"
                  >
                    <button className="group w-full py-5 bg-white/5 border-2 border-white/10 rounded-3xl text-[11px] font-mono text-gray-500 uppercase tracking-[0.3em] hover:bg-[#00ff9d]/10 hover:border-[#00ff9d]/50 hover:text-white transition-all duration-300 flex items-center justify-center gap-4">
                      <span>Generate PDF Report</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </motion.div>
                </motion.div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30 grayscale saturate-0">
                  <Cpu className="w-16 h-16 text-gray-600 mb-6" />
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em]">
                    Awaiting Data Buffer...
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </aside>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-8 left-8 right-8 z-50 bg-[#ff003c] text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5" />
            <span className="text-xs font-bold font-mono tracking-tight">
              {error}
            </span>
          </div>
          <button
            onClick={() => setError(null)}
            className="p-2 hover:bg-black/20 rounded-lg"
          >
            <ChevronRight className="w-5 h-5 rotate-90" />
          </button>
        </motion.div>
      )}
    </div>
  );
}

// Add these Lucide icons to the import above if missing: TrendingUp
