import { createFileRoute } from '@tanstack/react-router'
import DataPasienTable from '@/components/admin/data-pasien/DataPasienTable'

export const Route = createFileRoute('/admin/data-pasien')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <DataPasienTable />
  </div>
}
