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

export interface AttachedImage {
    id: string;
    url: string;
    fileName: string;
    imageRecommendation?: string;
    recommendedProduct?: string;
    operativeGuide?: string;
    biosecurityProtocol?: string;
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
