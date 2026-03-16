import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/testimoni')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/testimoni"!</div>
}
