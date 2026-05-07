import { api } from '@/api/axios';
import { ENDPOINTS } from '@/api/endpoints';

export const commentService = {
  async list(params?: Record<string, string | number | boolean>) {
    const response = await api.get(ENDPOINTS.comments.list, { params });
    return Array.isArray(response.data?.items) ? response.data.items : [];
  },
  async create(payload: Record<string, unknown>) {
    const response = await api.post(ENDPOINTS.comments.create, payload);
    return response.data;
  },
  async like(id: string) {
    const response = await api.post(ENDPOINTS.comments.like(id));
    return response.data;
  },
};
