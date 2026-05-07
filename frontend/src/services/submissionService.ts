import { api } from '@/api/axios';
import { ENDPOINTS } from '@/api/endpoints';

export type SubmissionLanguage = 'go' | 'cpp' | 'java' | 'python' | 'javascript' | 'rust';

interface SubmitCodePayload {
  problem_id: string;
  language: SubmissionLanguage;
  code: string;
  contest_id?: string;
}

export const submissionService = {
  async submit(payload: SubmitCodePayload) {
    const response = await api.post(ENDPOINTS.submissions.submit, payload);
    return response.data?.submission ?? null;
  },
  async mine(limit = 20, offset = 0) {
    const response = await api.get(ENDPOINTS.submissions.mine, { params: { limit, offset } });
    return Array.isArray(response.data?.items) ? response.data.items : [];
  },
};
