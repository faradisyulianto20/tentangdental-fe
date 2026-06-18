import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  deleteAdminPatient,
  downloadAdminPatientPdf,
  getAdminPatientById,
  getAdminPatientRontgens,
  getAdminPatients,
  getAdminRontgenDetail,
  updateAdminPatient,
  deleteAdminRontgenImage,
} from '@/services/patientService'
import type {
  AdminPatientDetail,
  AdminPatientRontgensData,
  AdminRontgenDetail,
  UpdateAdminPatientPayload,
} from '@/services/patientService'

type AdminPatientsQueryData = Awaited<ReturnType<typeof getAdminPatients>>

export const rontgenKeys = {
  all: ['rontgens'] as const,
  lists: () => [...rontgenKeys.all, 'list'] as const,
  detail: (id: string) => [...rontgenKeys.all, 'detail', id] as const,
}

export function useAdminPatients(page = 1, perPage = 10) {
  return useQuery<AdminPatientsQueryData>({
    queryKey: ['admin-patients', page, perPage],
    queryFn: () => getAdminPatients(page, perPage),
    staleTime: 1000 * 30,
  })
}

export function useAdminPatientById(id?: number, enabled = true) {
  return useQuery<AdminPatientDetail>({
    queryKey: ['admin-patients', id],
    queryFn: () => getAdminPatientById(id as number),
    enabled: enabled && typeof id === 'number',
    staleTime: 1000 * 30,
    refetchOnMount: 'always',
  })
}

export function useAdminPatientRontgens(id?: number, enabled = true) {
  return useQuery<AdminPatientRontgensData>({
    queryKey: ['admin-patient-rontgens', id],
    queryFn: () => getAdminPatientRontgens(id as number),
    enabled: enabled && typeof id === 'number',
    staleTime: 1000 * 30,
  })
}

export function useUpdateAdminPatient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateAdminPatientPayload) =>
      updateAdminPatient(payload),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['admin-patients'] })
      await queryClient.invalidateQueries({
        queryKey: ['admin-patients', variables.id],
      })
      await queryClient.invalidateQueries({
        queryKey: ['admin-patient-rontgens', variables.id],
      })
    },
  })
}

export function useDeleteAdminPatient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteAdminPatient(id),
    onSuccess: async (_, id) => {
      queryClient.removeQueries({ queryKey: ['admin-patients', id] })
      queryClient.removeQueries({ queryKey: ['admin-patient-rontgens', id] })
      await queryClient.invalidateQueries({ queryKey: ['admin-patients'] })
    },
  })
}

export function useDownloadAdminPatientPdf() {
  return useMutation({
    mutationFn: (id: number) => downloadAdminPatientPdf(id),
  })
}

export function useAdminRontgenDetail(id?: number, enabled = true) {
  return useQuery<AdminRontgenDetail>({
    queryKey: rontgenKeys.detail(String(id)),
    queryFn: () => getAdminRontgenDetail(id as number),
    enabled: enabled && typeof id === 'number',
    staleTime: 1000 * 30,
  })
}

export function useDeleteRontgenImage() {
  const queryClient = useQueryClient()
 
  return useMutation({
    mutationFn: ({ id, imageId }: { id: string; imageId: string }) =>
      deleteAdminRontgenImage(id, imageId),
 
    onSuccess: (_data, { id }) => {
      // Invalidate list dan detail agar UI refresh otomatis
      queryClient.invalidateQueries({ queryKey: rontgenKeys.lists() })
      queryClient.invalidateQueries({ queryKey: rontgenKeys.detail(id) })
    },
  })
}
