export interface Campaign {
    id: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
    createdAt: string;
}

export interface Field {
    id: string;
    name: string;
    irrigationType?: string;
    location?: string;
    createdAt: string;
}

export interface FieldCampaign {
    id: string;
    field: Field;
    campaign: Campaign;
    createdAt: string;
}

export interface ModelResult {
    id: string;
    diagnosis: string;
    confidence: number;
    boundingBox: number[]; // [x1, y1, x2, y2]
    model?: {
        name: string;
    };
}

export interface AttachedImage {
    id: string;
    url: string;
    fileName: string;
    imageRecommendation?: string;
    recommendedProduct?: string;
    operativeGuide?: string;
    biosecurityProtocol?: string;
    modelResults?: ModelResult[];
}

export interface AnalysisFieldCampaignHistory {
    id: string;
    date: string;
    generalSummary?: string;
    generalRecommendation?: string;
    recommendedProduct?: string;
    operativeGuide?: string;
    biosecurityProtocol?: string;
    phenologicalState?: string;
    soilQuality?: string;
    currentClimate?: string;
    isInfected: boolean;
    primaryTargetPest?: string;
    maxConfidence?: number;
    fieldCampaign: FieldCampaign;
    attachedImages: AttachedImage[];
}

export interface CampaignMetrics {
    totalScans: number;
    previousScans: number;
    scansChangePercentage: number;
    infectionRate: number;
    activeNodes: number;
    totalFields: number;
}

export interface PestsTemporalResponse {
    data: any[];
    topPests: string[];
}

export interface FieldsTemporalResponse {
    data: any[];
    topFields: string[];
}
