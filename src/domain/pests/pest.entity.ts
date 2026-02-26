export interface PestDetection {
    box: [number, number, number, number]; // [x1, y1, x2, y2]
    confidence: number;
    className: string;
    classId?: number;
    class_id?: number;
    model?: string | null;
}

export interface PestAnalysisResult {
    filename: string;
    detections: PestDetection[];
    models?: string[];
    verified?: boolean;
    verificationReason?: string | null;
}
