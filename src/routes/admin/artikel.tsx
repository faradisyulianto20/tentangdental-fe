import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/artikel')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/artikel"!</div>
}
