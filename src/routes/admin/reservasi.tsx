import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/reservasi')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/reservasi"!</div>
}
