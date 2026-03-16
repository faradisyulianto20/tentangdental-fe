import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/profil-dokter')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/profil-dokter"!</div>
}
