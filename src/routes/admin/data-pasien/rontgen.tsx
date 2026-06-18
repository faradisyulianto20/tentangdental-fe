import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQueries } from '@tanstack/react-query'
import { Download, Trash2 } from 'lucide-react'
import { ApiError } from '@/lib/api-client'
import {
  useAdminPatientRontgens,
  useDeleteRontgenImage,
} from '@/hooks/usePatient'
import {
  getAdminRontgenDetail,
  getAdminRontgenDownloadUrl,
} from '@/services/patientService'

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

  if (!id || !patientId || Number.isNaN(patientId)) {
    return (
      <div>
        <p className="text-destructive text-sm">ID pasien tidak valid.</p>
      </div>
    )
  }

  if (
    patientQuery.error instanceof ApiError &&
    patientQuery.error.status === 401
  ) {
    navigate({ to: '/login' })
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
  const rontgenList = patientQuery.data?.rontgens || []

  const rontgenDetails = useQueries({
    queries: rontgenList.map((rontgen) => ({
      queryKey: ['admin-rontgen-detail', rontgen.id],
      queryFn: () => getAdminRontgenDetail(rontgen.id),
      enabled: rontgenList.length > 0,
      staleTime: 1000 * 30,
    })),
  })

  const images = rontgenDetails.flatMap((detail) =>
    (detail.data?.examination_images || []).map((img) => ({
      rontgenId: detail.data!.id,
      id: img.id,
      imgPath: img.image_url,
      imageType: img.image_type,
      imagePhase: img.image_phase,
      title:
        img.image_type === 'xray'
          ? 'X-Ray'
          : img.image_type === 'profil_gigi'
            ? 'Profil Gigi'
            : img.image_type === 'intraoral'
              ? 'Intraoral'
              : img.image_type === 'dental'
                ? 'Dental'
                : `Rontgen ${detail.data!.id}`,
    })),
  )

  const handleDelete = (rontgenId: number, imageId: number) => {
    if (!confirm('Yakin ingin menghapus foto rontgen ini?')) return

    deleteImageMutation.mutate({
      id: String(rontgenId),
      imageId: String(imageId),
    })
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
              <a
                href={getAdminRontgenDownloadUrl(item.rontgenId)}
                download
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/90 hover:bg-white text-green-600 hover:scale-110 transition-all shadow"
                title="Unduh foto"
              >
                <Download className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => handleDelete(item.rontgenId, item.id)}
                disabled={deleteImageMutation.isPending}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/90 hover:bg-white text-destructive hover:scale-110 transition-all shadow disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  )
}
