import PestScanner from '@/presentation/pests/components/PestScanner';

export default function ScanPage() {
    return (
        <div className="container mx-auto py-10">
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold tracking-tight mb-2">Pest Detection</h1>
                <p className="text-muted-foreground">
                    Upload an image of a tomato leaf or trap to detect Tuta absoluta, Whitefly, or Leafminers.
                </p>
            </div>

            <PestScanner />
        </div>
    );
}
