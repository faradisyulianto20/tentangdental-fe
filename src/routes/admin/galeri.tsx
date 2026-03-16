import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/galeri')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/galeri"!</div>
}
