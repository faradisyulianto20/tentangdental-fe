import { createFileRoute } from '@tanstack/react-router'
import ProfilDokter from '#/components/beranda/ProfilDokter'

export const Route = createFileRoute('/profil-dokter')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ProfilDokter />
}
