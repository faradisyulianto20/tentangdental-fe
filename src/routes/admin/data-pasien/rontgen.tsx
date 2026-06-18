import { useEffect, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQueries, useQueryClient } from '@tanstack/react-query'
import { Download, Trash2 } from 'lucide-react'
import { getStoredToken } from '@/lib/auth-storage'
import { ApiError } from '@/lib/api-client'
import {
  useAdminPatientRontgens,
  useDeleteRontgenImage,
} from '@/hooks/usePatient'
import {
  getAdminRontgenDetail,
  getAdminRontgenDownloadUrl,
} from '@/services/patientService'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

type RontgenSearch = {
  id?: string
}

export const Route = createFileRoute('/admin/data-pasien/rontgen')({
  validateSearch: (search: Record<string, unknown>): RontgenSearch => ({
    id: (search.id as string) || undefined,
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { id } = Route.useSearch()
  const patientId = id ? Number(id) : undefined

  const patientQuery = useAdminPatientRontgens(
    typeof patientId === 'number' && !Number.isNaN(patientId)
      ? patientId
      : undefined,
  )

  const deleteImageMutation = useDeleteRontgenImage()
  const queryClient = useQueryClient()
  const [selectedImage, setSelectedImage] = useState<{
    rontgenId: number
    imageId: number
  } | null>(null)

  const rontgenList = patientQuery.data?.rontgens || []

  const rontgenDetails = useQueries({
    queries: rontgenList.map((rontgen) => ({
      queryKey: ['admin-rontgen-detail', rontgen.id],
      queryFn: () => getAdminRontgenDetail(rontgen.id),
      enabled: rontgenList.length > 0,
      staleTime: 1000 * 30,
    })),
  })

  useEffect(() => {
    if (
      patientQuery.error instanceof ApiError &&
      patientQuery.error.status === 401
    ) {
      navigate({ to: '/login' })
    }
  }, [patientQuery.error, navigate])

  if (!id || !patientId || Number.isNaN(patientId)) {
    return (
      <div>
        <p className="text-destructive text-sm">ID pasien tidak valid.</p>
      </div>
    )
  }

  if (patientQuery.isLoading) {
    return (
      <p className="text-sm text-muted-foreground">Memuat data rontgen...</p>
    )
  }

  if (
    patientQuery.error instanceof ApiError &&
    patientQuery.error.status === 403
  ) {
    return <p className="text-sm text-destructive">Akses ditolak.</p>
  }

  if (
    patientQuery.error instanceof ApiError &&
    patientQuery.error.status === 404
  ) {
    return <p className="text-sm text-destructive">Pasien tidak ditemukan.</p>
  }

  const patient = patientQuery.data

  const imageTypeLabels: Record<string, string> = {
    xray: 'X-Ray',
    profil_gigi: 'Profil Gigi',
    intraoral: 'Intraoral',
    dental: 'Dental',
  }

  const images = rontgenDetails.flatMap((detail) =>
    (detail.data?.examination_images || []).map((img) => ({
      rontgenId: detail.data!.id,
      id: img.id,
      imgPath: img.image_url,
      imagePhase: img.image_phase,
      title: imageTypeLabels[img.image_type] ?? `Rontgen ${detail.data!.id}`,
    })),
  )

  const handleDownload = async (rontgenId: number, filename: string) => {
    try {
      const token = getStoredToken()
      const response = await fetch(getAdminRontgenDownloadUrl(rontgenId), {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
      if (!response.ok) throw new Error('Download gagal')
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download gagal:', error)
    }
  }

  const handleDelete = (rontgenId: number, imageId: number) => {
    setSelectedImage({ rontgenId, imageId })
  }

  const confirmDelete = async () => {
    if (!selectedImage) return

    deleteImageMutation.mutate(
      {
        id: String(selectedImage.rontgenId),
        imageId: String(selectedImage.imageId),
      },
      {
        onSettled: () => setSelectedImage(null),
        onSuccess: () => {
          queryClient.invalidateQueries()
        },
      },
    )
  }

  return (
    <div>
      <div>
        <h1 className="font-bold text-2xl">{patient?.name || '-'}</h1>
        <p className="text-sm text-muted-foreground">
          Nomor Pasien: {patient?.id || '-'}
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {images.map((item) => (
          <div className="group relative" key={`${item.rontgenId}-${item.id}`}>
            <img
              src={item.imgPath}
              alt={item.title}
              className="w-full h-48 object-cover rounded-md hover:brightness-75 transition-all"
            />
            <div className="group-hover:opacity-100 opacity-0 absolute inset-0 flex items-center justify-center gap-2 transition-all">
              <button
                type="button"
                onClick={() => handleDownload(item.rontgenId, item.title)}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/90 hover:bg-white text-green-600 hover:scale-110 transition-all shadow cursor-pointer"
                title="Unduh foto"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleDelete(item.rontgenId, item.id)}
                disabled={deleteImageMutation.isPending}
                className="cursor-pointer flex items-center justify-center w-9 h-9 rounded-full bg-white/90 hover:bg-white text-destructive hover:scale-110 transition-all shadow disabled:opacity-50 disabled:cursor-not-allowed"
                title="Hapus foto"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-muted-foreground truncate">
                {item.title}
              </p>
              {item.imagePhase && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                  {item.imagePhase}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      {images.length === 0 ? (
        <p className="text-sm text-muted-foreground mt-4">
          Belum ada foto rontgen untuk pasien ini.
        </p>
      ) : null}

      <AlertDialog
        open={!!selectedImage}
        onOpenChange={(open) => !open && setSelectedImage(null)}
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Foto Rontgen</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus foto rontgen ini? Tindakan ini
              tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              disabled={deleteImageMutation.isPending}
              onClick={(e) => {
                e.preventDefault()
                confirmDelete()
              }}
            >
              {deleteImageMutation.isPending ? 'Menghapus...' : 'Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
