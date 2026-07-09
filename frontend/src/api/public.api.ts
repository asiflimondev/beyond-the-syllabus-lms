import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ✅ Public API client - NO authentication headers
export const publicApiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface PublicProgram {
  id: string;
  name: string;
  displayName: {
    en: string;
    bn: string;
  };
  description: {
    en: string;
    bn: string;
  };
  duration: number;
  fee: number;
  isActive: boolean;
}

export const publicApi = {
  // ✅ Public endpoint - No authentication required
  getPrograms: (params?: { limit?: number }) =>
    publicApiClient.get('/public/programs', { params }),
};