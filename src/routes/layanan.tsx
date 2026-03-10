import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/layanan')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/layanan"!</div>
}
