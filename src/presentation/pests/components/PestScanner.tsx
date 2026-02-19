'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2, Bug } from 'lucide-react';
import { PestApiRepository } from '@/data/pests/pest-api.repository';
import { PestAnalysisResult } from '@/domain/pests/pest.entity';
import { toast } from 'sonner';

export default function PestScanner() {
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<PestAnalysisResult | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const repository = new PestApiRepository();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload an image file');
                return;
            }
            setImage(file);
            setPreview(URL.createObjectURL(file));
            setResult(null);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload an image file');
                return;
            }
            setImage(file);
            setPreview(URL.createObjectURL(file));
            setResult(null);
        }
    };

    const handleAnalyze = async () => {
        if (!image) return;

        setLoading(true);
        try {
            const data = await repository.analyzeImage(image);
            setResult(data);
            drawImageWithBoxes(data);
            toast.success('Análisis completado');
        } catch (error) {
            console.error(error);
            toast.error('Error al analizar la imagen');
        } finally {
            setLoading(false);
        }
    };

    const drawImageWithBoxes = (data: PestAnalysisResult) => {
        const canvas = canvasRef.current;
        const img = new Image();
        img.src = preview!;

        img.onload = () => {
            if (!canvas) return;
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Draw image
            ctx.drawImage(img, 0, 0);

            // Draw boxes
            data.detections.forEach(d => {
                const [x1, y1, x2, y2] = d.box;

                // Box color based on confidence
                ctx.strokeStyle = d.confidence > 0.7 ? '#00ff00' : '#ff0000';
                ctx.lineWidth = 4;
                ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

                // Label
                ctx.fillStyle = d.confidence > 0.7 ? '#00ff00' : '#ff0000';
                ctx.font = '20px Arial';
                const label = `${d.className} (${(d.confidence * 100).toFixed(1)}%)`;
                ctx.fillText(label, x1, y1 - 5);
            });
        };
    };

    const reset = () => {
        setImage(null);
        setPreview(null);
        setResult(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
            <div
                className={`relative w-full border-2 border-dashed rounded-xl flex items-center justify-center overflow-hidden transition-colors cursor-pointer
          ${preview ? 'border-primary/50' : 'border-muted-foreground/25 hover:border-primary/50'}
          ${loading ? 'opacity-50 pointer-events-none' : ''}`}
                style={{ height: '500px' }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => !preview && fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />

                {!preview ? (
                    <div className="flex flex-col items-center gap-4 text-muted-foreground p-8">
                        <div className="bg-muted p-4 rounded-full">
                            <Upload className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-lg font-medium text-foreground">Haz clic o arrastra una imagen para subir</p>
                            <p className="text-sm">Soporta hojas de tomate y trampas</p>
                        </div>
                    </div>
                ) : (
                    <div className="w-full h-full p-4 flex items-center justify-center bg-accent/10">
                        <div className="relative inline-block max-w-full max-h-full">
                            <button
                                onClick={(e) => { e.stopPropagation(); reset(); }}
                                className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 z-10"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <img
                                src={preview}
                                alt="Preview"
                                className="block w-auto h-auto max-w-full max-h-full object-contain"
                                style={{ maxHeight: '460px' }} // 500px container - 40px padding
                            />

                            <canvas
                                ref={canvasRef}
                                className={`absolute inset-0 w-full h-full pointer-events-none ${!result ? 'hidden' : 'block'}`}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-center">
                {!result && preview && (
                    <button
                        onClick={handleAnalyze}
                        disabled={loading}
                        className="px-8 py-3 bg-primary text-primary-foreground rounded-lg cursor-pointer font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Bug className="w-5 h-5" />}
                        Analizar Plaga
                    </button>
                )}
            </div>

            {result && result.detections.length > 0 && (
                <div className="bg-card border rounded-xl p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Bug className="w-5 h-5 text-primary" />
                        Resultados del Análisis
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {result.detections.map((d, i) => (
                            <div key={i} className="p-3 bg-muted/50 rounded-lg border flex justify-between items-center">
                                <span className="font-medium capitalize">{d.className.replace('_', ' ')}</span>
                                <div className="flex items-center gap-2">
                                    <div className={`h-2 w-2 rounded-full ${d.confidence > 0.7 ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                    <span className="text-sm text-muted-foreground">{(d.confidence * 100).toFixed(0)}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {result && result.detections.length === 0 && (
                <div className="bg-card border rounded-xl p-6 shadow-sm text-center text-muted-foreground">
                    No se detectaron plagas con alta confianza.
                </div>
            )}
        </div>
    );
}
