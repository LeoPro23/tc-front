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
    location?: string;
    createdAt: string;
}

export interface FieldCampaign {
    id: string;
    field: Field;
    campaign: Campaign;
    createdAt: string;
}
