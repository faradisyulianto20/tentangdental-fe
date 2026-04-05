import { createFileRoute } from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router'
import { Download } from 'lucide-react'
import { ApiError } from '@/lib/api-client'
import { useAdminPatientRontgens } from '@/hooks/usePatient'

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
    return <p className="text-sm text-destructive">Pasien tidak ditemukan.</p>
  }

  const patient = rontgensQuery.data?.patient
  const rontgens = rontgensQuery.data?.rontgens || []
  const images = rontgens.flatMap((rontgen) =>
    (rontgen.images || []).map((image) => ({
      id: image.id,
      imgPath: image.image_url,
      title: image.image_type || `Rontgen ${rontgen.id}`,
    })),
  )

  return (
    <div>
      <div>
        <h1 className="font-bold text-2xl">{patient?.name || '-'}</h1>
        <p className="text-sm text-muted-foreground">
          Nomor Pasien: {patient?.patient_number || '-'}
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {images.map((item) => (
          <div className="group relative" key={item.id}>
            <img
              src={item.imgPath}
              alt={item.title}
              className="w-full h-48 object-cover rounded-md hover:brightness-90 transition-all"
            />
            <a
              href={item.imgPath}
              target="_blank"
              rel="noreferrer"
              className="group-hover:opacity-100 opacity-0 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <Download className="w-8 h-8 rounded-full p-1.5 text-green-600 bg-white/80 hover:bg-white transition-all cursor-pointer" />
            </a>
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
