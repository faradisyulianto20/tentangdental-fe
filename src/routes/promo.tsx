import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/promo')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/promo"!</div>
}
