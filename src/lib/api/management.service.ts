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
    }
};
