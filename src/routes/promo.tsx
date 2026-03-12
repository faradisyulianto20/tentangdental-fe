import Promo from '#/components/beranda/Promo'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/promo')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='w-full flex justify-center'>
    <Promo />
  </div>
}
