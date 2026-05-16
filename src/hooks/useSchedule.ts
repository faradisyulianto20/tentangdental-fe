import { useQuery } from '@tanstack/react-query'
import { getScheduleOptions, type ScheduleOptions } from '@/services/scheduleService'

/**
 * Hook to fetch schedule options
 * Returns days, time slots, default schedule, and dropdown options
 */
export function useScheduleOptions() {
  return useQuery<ScheduleOptions>({
    queryKey: ['schedule-options'],
    queryFn: getScheduleOptions,
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}
