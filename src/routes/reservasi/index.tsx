import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/reservasi/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/reservasi/"!</div>
}
