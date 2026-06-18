import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createAdminService,
  deleteAdminService,
  getAdminServiceById,
  getAdminServices,
  getLayanan,
  getLayananById,
  updateAdminService
  
  
  
  
} from '@/services/layananService'
import type {AdminServiceItem, AdminServicePagination, CreateAdminServicePayload, UpdateAdminServicePayload} from '@/services/layananService';

type AdminServicesQueryData = {
  services: AdminServiceItem[]
  pagination: AdminServicePagination
}

export function useLayanan() {
  return useQuery({
    queryKey: ['layanan'],
    queryFn: getLayanan,
    staleTime: 1000 * 60 * 5,
  })
}

export function useLayananById(id: string) {
  return useQuery({
    queryKey: ['layanan', id],
    queryFn: () => getLayananById(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  })
}

export function useAdminServices() {
  return useQuery({
    queryKey: ['admin-services'],
    queryFn: getAdminServices,
    staleTime: 1000 * 60,
  })
}

export function useAdminServiceById(id?: number) {
  return useQuery({
    queryKey: ['admin-services', id],
    queryFn: () => getAdminServiceById(id as number),
    enabled: typeof id === 'number',
    staleTime: 1000 * 60,
  })
}

export function useCreateAdminService() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateAdminServicePayload) =>
      createAdminService(payload),
    onSuccess: async (createdService) => {
      queryClient.setQueryData<AdminServicesQueryData>(
        ['admin-services'],
        (prev) => {
          if (!prev) return prev

          return {
            ...prev,
            services: [createdService, ...prev.services],
            pagination: {
              ...prev.pagination,
              total: prev.pagination.total + 1,
            },
          }
        },
      )

      await queryClient.invalidateQueries({ queryKey: ['admin-services'] })
      await queryClient.invalidateQueries({ queryKey: ['layanan'] })
    },
  })
}

export function useUpdateAdminService() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateAdminServicePayload) =>
      updateAdminService(payload),
    onSuccess: async (updatedService) => {
      queryClient.setQueryData<AdminServicesQueryData>(
        ['admin-services'],
        (prev) => {
          if (!prev) return prev

          return {
            ...prev,
            services: prev.services.map((service) =>
              service.id === updatedService.id ? updatedService : service,
            ),
          }
        },
      )

      queryClient.setQueryData(
        ['admin-services', updatedService.id],
        updatedService,
      )
      await queryClient.invalidateQueries({ queryKey: ['admin-services'] })
      await queryClient.invalidateQueries({ queryKey: ['layanan'] })
    },
  })
}

export function useDeleteAdminService() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteAdminService(id),
    onSuccess: async (_, deletedId) => {
      queryClient.setQueryData<AdminServicesQueryData>(
        ['admin-services'],
        (prev) => {
          if (!prev) return prev

          const nextServices = prev.services.filter(
            (service) => service.id !== deletedId,
          )
          const nextTotal = Math.max(0, prev.pagination.total - 1)

          return {
            ...prev,
            services: nextServices,
            pagination: {
              ...prev.pagination,
              total: nextTotal,
            },
          }
        },
      )

      queryClient.removeQueries({ queryKey: ['admin-services', deletedId] })
      await queryClient.invalidateQueries({ queryKey: ['admin-services'] })
      await queryClient.invalidateQueries({ queryKey: ['layanan'] })
    },
  })
}
