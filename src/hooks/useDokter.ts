import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createAdminDoctor,
  deleteAdminDoctor,
  getAdminDoctorById,
  getAdminDoctors,
  getDoctors,
  updateAdminDoctor,
  type AdminDoctorPagination,
  type CreateAdminDoctorPayload,
  type DoctorApiItem,
  type UpdateAdminDoctorPayload,
} from '@/services/dokterService'

type AdminDoctorsQueryData = {
  doctors: DoctorApiItem[]
  pagination: AdminDoctorPagination
}

export function useDokter() {
  return useQuery({
    queryKey: ['dokter'],
    queryFn: getDoctors,
    staleTime: 1000 * 60 * 5,
  })
}

export function useAdminDoctors() {
  return useQuery({
    queryKey: ['admin-doctors'],
    queryFn: getAdminDoctors,
    staleTime: 1000 * 60,
  })
}

export function useAdminDoctorById(id?: number) {
  return useQuery({
    queryKey: ['admin-doctors', id],
    queryFn: () => getAdminDoctorById(id as number),
    enabled: typeof id === 'number',
    staleTime: 1000 * 60,
  })
}

export function useCreateAdminDoctor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateAdminDoctorPayload) =>
      createAdminDoctor(payload),
    onSuccess: async (createdDoctor) => {
      queryClient.setQueryData<AdminDoctorsQueryData>(
        ['admin-doctors'],
        (prev) => {
          if (!prev) return prev

          return {
            ...prev,
            doctors: [createdDoctor, ...prev.doctors],
            pagination: {
              ...prev.pagination,
              total: prev.pagination.total + 1,
            },
          }
        },
      )

      await queryClient.invalidateQueries({ queryKey: ['admin-doctors'] })
      await queryClient.invalidateQueries({ queryKey: ['dokter'] })
    },
  })
}

export function useUpdateAdminDoctor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateAdminDoctorPayload) =>
      updateAdminDoctor(payload),
    onSuccess: async (updatedDoctor) => {
      queryClient.setQueryData<AdminDoctorsQueryData>(
        ['admin-doctors'],
        (prev) => {
          if (!prev) return prev

          return {
            ...prev,
            doctors: prev.doctors.map((doctor) =>
              doctor.id === updatedDoctor.id ? updatedDoctor : doctor,
            ),
          }
        },
      )

      queryClient.setQueryData(
        ['admin-doctors', updatedDoctor.id],
        updatedDoctor,
      )
      await queryClient.invalidateQueries({ queryKey: ['admin-doctors'] })
      await queryClient.invalidateQueries({ queryKey: ['dokter'] })
    },
  })
}

export function useDeleteAdminDoctor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteAdminDoctor(id),
    onSuccess: async (_, deletedId) => {
      queryClient.setQueryData<AdminDoctorsQueryData>(
        ['admin-doctors'],
        (prev) => {
          if (!prev) return prev

          const nextDoctors = prev.doctors.filter(
            (doctor) => doctor.id !== deletedId,
          )
          const nextTotal = Math.max(0, prev.pagination.total - 1)

          return {
            ...prev,
            doctors: nextDoctors,
            pagination: {
              ...prev.pagination,
              total: nextTotal,
            },
          }
        },
      )

      queryClient.removeQueries({ queryKey: ['admin-doctors', deletedId] })
      await queryClient.invalidateQueries({ queryKey: ['admin-doctors'] })
      await queryClient.invalidateQueries({ queryKey: ['dokter'] })
    },
  })
}
