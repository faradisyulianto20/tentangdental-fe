import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/profil-dokter')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/profil-dokter"!</div>
}
