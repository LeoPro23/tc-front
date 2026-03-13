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

export interface AnalysisComment {
    id: string;
    audioUrl: string;
    transcription: string;
    diagnosis?: string;
    treatment?: string;
    createdAt: string;
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
    comment?: AnalysisComment;
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

export interface PestEvolutionResponse {
    pest: string | null;
    topFields: string[];
    data: any[];
}

export interface FieldRiskProfileResponse {
    pests: string[];
    fields: string[];
    data: any[];
}

export interface FieldPerformanceResponse {
    field: string | null;
    data: {
        date: string;
        campaignAverage: number;
        fieldIncidence: number;
    }[];
}

export interface StrategicRecommendationResponse {
    chartInterpretation: string;
    summary: string;
    actionPlan: string;
}

export interface CompareEvolutionResponse {
    campaigns: string[];
    data: any[];
}

export interface CompareRiskProfileResponse {
    pests: string[];
    campaigns: string[];
    data: any[];
}

export interface ComparePerformanceResponse {
    campaigns: string[];
    data: any[];
}
