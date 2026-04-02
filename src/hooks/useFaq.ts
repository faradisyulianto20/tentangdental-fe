import { useQuery } from '@tanstack/react-query'
import { getFaqs } from '#/services/faqService'

export function useFaq() {
  return useQuery({
    queryKey: ['faqs'],
    queryFn: getFaqs,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
