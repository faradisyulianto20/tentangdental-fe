import { createFileRoute } from '@tanstack/react-router'
import NotFound from '../components/error/NotFound'

export const Route = createFileRoute('/not-found')({
  component: NotFoundRoute,
})

function NotFoundRoute() {
  return <NotFound />
}