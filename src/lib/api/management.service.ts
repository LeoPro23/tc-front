import type { Campaign, Field, FieldCampaign } from './management.types';
import axios from 'axios';
import { getToken } from '../auth-helpers';
import { URL_BACKEND } from '@/shared/config/backend-url';

const API_URL = URL_BACKEND;

function getHeaders() {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    };
}

export const managementApi = {
    // Campaigns
    getCampaigns: async (): Promise<Campaign[]> => {
        const res = await axios.get(`${API_URL}/campaigns`, { headers: getHeaders() });
        return res.data;
    },
    createCampaign: async (startDate: string, endDate: string): Promise<Campaign> => {
        const res = await axios.post(`${API_URL}/campaigns`, { startDate, endDate }, { headers: getHeaders() });
        return res.data;
    },
    updateCampaign: async (id: string, startDate: string, endDate: string): Promise<Campaign> => {
        const res = await axios.patch(`${API_URL}/campaigns/${id}`, { startDate, endDate }, { headers: getHeaders() });
        return res.data;
    },
    getMetrics: async (campaignId?: string): Promise<import('./management.types').CampaignMetrics> => {
        const query = campaignId ? `?campaignId=${campaignId}` : '';
        const res = await axios.get(`${API_URL}/campaigns/metrics${query}`, { headers: getHeaders() });
        return res.data;
    },
    getPestsTemporal: async (fieldIds?: string[]): Promise<import('./management.types').PestsTemporalResponse> => {
        const query = fieldIds && fieldIds.length > 0 ? `?fieldIds=${fieldIds.join(',')}` : '';
        const res = await axios.get(`${API_URL}/campaigns/pests-temporal${query}`, { headers: getHeaders() });
        return res.data;
    },
    getFieldsTemporal: async (fieldIds?: string[]): Promise<import('./management.types').FieldsTemporalResponse> => {
        const query = fieldIds && fieldIds.length > 0 ? `?fieldIds=${fieldIds.join(',')}` : '';
        const res = await axios.get(`${API_URL}/campaigns/fields-temporal${query}`, { headers: getHeaders() });
        return res.data;
    },

    // Fields
    getFields: async (): Promise<Field[]> => {
        const res = await axios.get(`${API_URL}/fields`, { headers: getHeaders() });
        return res.data;
    },
    createField: async (name: string, irrigationType?: string): Promise<Field> => {
        const res = await axios.post(`${API_URL}/fields`, { name, irrigationType }, { headers: getHeaders() });
        return res.data;
    },
    updateField: async (id: string, data: { name?: string; irrigationType?: string }): Promise<Field> => {
        const res = await axios.patch(`${API_URL}/fields/${id}`, data, { headers: getHeaders() });
        return res.data;
    },

    // Field-Campaigns (Enrollment)
    getEnrolledFields: async (campaignId: string): Promise<FieldCampaign[]> => {
        const res = await axios.get(`${API_URL}/field-campaigns/campaign/${campaignId}`, { headers: getHeaders() });
        return res.data;
    },
    enrollField: async (fieldId: string, campaignId: string): Promise<FieldCampaign> => {
        const res = await axios.post(`${API_URL}/field-campaigns`, { fieldId, campaignId }, { headers: getHeaders() });
        return res.data;
    },

    // Analysis History
    getScanHistory: async (params: {
        campaignId: string;
        isInfected?: boolean;
        fieldIds?: string[];
        startDate?: string;
        endDate?: string;
    }): Promise<import('./management.types').AnalysisFieldCampaignHistory[]> => {
        const queryParams = new URLSearchParams();
        queryParams.append('campaignId', params.campaignId);

        if (params.isInfected !== undefined) {
            queryParams.append('isInfected', String(params.isInfected));
        }
        if (params.fieldIds && params.fieldIds.length > 0) {
            queryParams.append('fieldIds', params.fieldIds.join(','));
        }
        if (params.startDate) {
            queryParams.append('startDate', params.startDate);
        }
        if (params.endDate) {
            queryParams.append('endDate', params.endDate);
        }

        const res = await axios.get(`${API_URL}/analysis-field-campaigns/history?${queryParams.toString()}`, { headers: getHeaders() });
        return res.data;
    },

    getScanDetails: async (id: string): Promise<import('./management.types').AnalysisFieldCampaignHistory> => {
        const res = await axios.get(`${API_URL}/analysis-field-campaigns/${id}`, { headers: getHeaders() });
        return res.data;
    },

    uploadAnalysisComment: async (analysisId: string, audioBlob: Blob): Promise<{ message: string }> => {
        const formData = new FormData();
        formData.append('audio', audioBlob, 'comment.webm');
        const token = getToken();
        
        const res = await axios.post(`${API_URL}/analysis-comments/${analysisId}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    },

    getPestEvolution: async (pest?: string, campaignId?: string): Promise<import('./management.types').PestEvolutionResponse> => {
        const queryParams = new URLSearchParams();
        if (pest) queryParams.append('pest', pest);
        if (campaignId) queryParams.append('campaignId', campaignId);
        const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
        const res = await axios.get(`${API_URL}/campaigns/pest-evolution${query}`, { headers: getHeaders() });
        return res.data;
    },

    getFieldRiskProfile: async (campaignId?: string): Promise<import('./management.types').FieldRiskProfileResponse> => {
        const query = campaignId ? `?campaignId=${campaignId}` : '';
        const res = await axios.get(`${API_URL}/campaigns/field-risk-profile${query}`, { headers: getHeaders() });
        return res.data;
    },

    getFieldPerformance: async (field?: string, campaignId?: string): Promise<import('./management.types').FieldPerformanceResponse> => {
        const queryParams = new URLSearchParams();
        if (field) queryParams.append('field', field);
        if (campaignId) queryParams.append('campaignId', campaignId);
        const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
        const res = await axios.get(`${API_URL}/campaigns/field-performance${query}`, { headers: getHeaders() });
        return res.data;
    },

    getStrategicRecommendation: async (campaignId?: string): Promise<import('./management.types').StrategicRecommendationResponse> => {
        const query = campaignId ? `?campaignId=${campaignId}` : '';
        const res = await axios.get(`${API_URL}/campaigns/strategic-recommendation${query}`, { headers: getHeaders() });
        return res.data;
    },

    getCompareEvolution: async (campaignIds: string[]): Promise<import('./management.types').CompareEvolutionResponse> => {
        const query = campaignIds.length > 0 ? `?campaignIds=${campaignIds.join(',')}` : '';
        const res = await axios.get(`${API_URL}/campaigns/compare-evolution${query}`, { headers: getHeaders() });
        return res.data;
    },

    getCompareRiskProfile: async (campaignIds: string[]): Promise<import('./management.types').CompareRiskProfileResponse> => {
        const query = campaignIds.length > 0 ? `?campaignIds=${campaignIds.join(',')}` : '';
        const res = await axios.get(`${API_URL}/campaigns/compare-risk-profile${query}`, { headers: getHeaders() });
        return res.data;
    },

    getComparePerformance: async (campaignIds: string[]): Promise<import('./management.types').ComparePerformanceResponse> => {
        const query = campaignIds.length > 0 ? `?campaignIds=${campaignIds.join(',')}` : '';
        const res = await axios.get(`${API_URL}/campaigns/compare-performance${query}`, { headers: getHeaders() });
        return res.data;
    }
};
