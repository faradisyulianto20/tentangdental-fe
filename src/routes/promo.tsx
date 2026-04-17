import PromoPage from '#/components/beranda/PromoPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/promo')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="w-full flex justify-center">
      <PromoPage />
    </div>
  )
}
