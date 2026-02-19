export interface PestDetection {
    box: [number, number, number, number]; // [x1, y1, x2, y2]
    confidence: number;
    className: string;
    class_id: number;
}

export interface PestAnalysisResult {
    filename: string;
    detections: PestDetection[];
}
