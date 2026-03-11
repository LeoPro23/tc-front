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
    getMetrics: async (): Promise<import('./management.types').CampaignMetrics> => {
        const res = await axios.get(`${API_URL}/campaigns/metrics`, { headers: getHeaders() });
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
    }
};
