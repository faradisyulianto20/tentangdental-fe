import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/layanan')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/layanan"!</div>
}
