import { createFileRoute } from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router'
import { Download, Trash2 } from 'lucide-react'
import { ApiError } from '@/lib/api-client'
import { useAdminPatientRontgens, useDeleteRontgenImage } from '@/hooks/usePatient'

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

  const rontgensQuery = useAdminPatientRontgens(
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
    rontgensQuery.error instanceof ApiError &&
    rontgensQuery.error.status === 401
  ) {
    navigate({ to: '/login' })
  }

  if (rontgensQuery.isLoading) {
    return (
      <p className="text-sm text-muted-foreground">Memuat data rontgen...</p>
    )
  }

  if (
    rontgensQuery.error instanceof ApiError &&
    rontgensQuery.error.status === 403
  ) {
    return <p className="text-sm text-destructive">Akses ditolak.</p>
  }

  if (
    rontgensQuery.error instanceof ApiError &&
    rontgensQuery.error.status === 404
  ) {
    console.error('❌ API 404 - Pasien tidak ditemukan', {
      patientId,
      error: rontgensQuery.error,
      payload: rontgensQuery.error.payload,
    })
    return <p className="text-sm text-destructive">Pasien tidak ditemukan.</p>
  }

  if (rontgensQuery.error) {
    console.error('❌ Query Error', {
      patientId,
      error: rontgensQuery.error,
    })
  }

  const patient = rontgensQuery.data
  const rontgens = rontgensQuery.data?.rontgens || []
  const images = rontgens.flatMap((rontgen) =>
    (rontgen.images || []).map((image) => ({
      id: image.id,
      imgPath: image.image_url,
      title: image.image_type || `Rontgen ${rontgen.id}`,
    })),
  )

  const handleDelete = (id: number, imageId: number) => {
  if (!confirm('Yakin ingin menghapus foto rontgen ini?')) return
  
  deleteImageMutation.mutate({ 
    id: String(id), 
    imageId: String(imageId) 
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
          <div className="group relative" key={item.id}>
            <img
              src={item.imgPath}
              alt={item.title}
              className="w-full h-48 object-cover rounded-md hover:brightness-75 transition-all"
            />
            {/* Action buttons overlay */}
            <div className="group-hover:opacity-100 opacity-0 absolute inset-0 flex items-center justify-center gap-2 transition-all">
              {/* Download button */}
              <a
                href={item.imgPath}
                download={`${item.title}.jpg`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/90 hover:bg-white text-green-600 hover:scale-110 transition-all shadow"
                title="Unduh foto"
              >
                <Download className="w-4 h-4" />
              </a>
              {/* Delete button */}
              <button
                type="button"
                onClick={() => handleDelete(item.id, item.id)}
                disabled={deleteImageMutation.isPending}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/90 hover:bg-white text-destructive hover:scale-110 transition-all shadow disabled:opacity-50 disabled:cursor-not-allowed"
                title="Hapus foto"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            {/* Image title */}
            <p className="text-xs text-muted-foreground mt-1 truncate">{item.title}</p>
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