import PestScanner from '@/presentation/pests/components/PestScanner';

export default function ScanPage() {
    return (
        <div className="container mx-auto py-10">
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold tracking-tight mb-2">Detección de Plagas</h1>
                <p className="text-muted-foreground">
                    Sube una imagen de una hoja de tomate o trampa para detectar Tuta absoluta, Mosca blanca o Minadores.
                </p>
            </div>

            <PestScanner />
        </div>
    );
}
