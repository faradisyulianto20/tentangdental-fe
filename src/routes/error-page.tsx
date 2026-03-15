import { createFileRoute } from '@tanstack/react-router'
import ErrorPage from '../components/error/ErrorPage'

export const Route = createFileRoute('/error-page')({
  component: ErrorPageRoute,
})

function ErrorPageRoute() {
  return (
    <ErrorPage
      error={new Error('Terjadi kesalahan di server. Silakan coba lagi.')}
    />
  )
}