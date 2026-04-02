import { apiRequest } from "#/lib/api-client";

export type FaqApiItem = {
  id: number;
  question: string;
  answer: string;
}

export async function getFaqs(): Promise<FaqApiItem[]> {
  const response = await apiRequest<FaqApiItem[]>('faqs', {
    method: 'GET',
    auth: false,
  })
  return Array.isArray(response) ? response : []
}