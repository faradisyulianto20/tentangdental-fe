import { createFileRoute } from '@tanstack/react-router'
import DataPasienTable from '@/components/admin/data-pasien/DataPasienTable'
import DetailPasien from '@/components/admin/data-pasien/DetailPasien' // Pastikan import ini ada

// 1. Definisikan tipe untuk search params
type PasienSearch = {
  id?: string
}

export const Route = createFileRoute('/admin/data-pasien/')({
  // 2. Validasi search params agar bisa dibaca oleh component
  validateSearch: (search: Record<string, unknown>): PasienSearch => {
    return {
      id: (search.id as string) || undefined,
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  // 3. Baca param 'id' menggunakan useSearch
  const { id } = Route.useSearch()

  // 4. Kondisi: Jika ada ID, tampilkan Detail, jika tidak tampilkan Tabel
  if (id) {
    return <DetailPasien id={id} />
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Daftar Pasien</h1>
      <DataPasienTable />
    </div>
  )
}