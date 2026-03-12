import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/berita')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/berita"!</div>
}
