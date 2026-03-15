import FormReservasi from '@/components/beranda/reservasi/FormReservasi'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/reservasi')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="max-w-5xl mx-6 xl:mx-auto mt-12">
      <div>
        <div className="flex gap-6 border-b-2 pb-6">
          <img
            src="/icons/fi-ss-calendar.svg"
            alt="Reservasi"
            className="w-18 h-18 object-cover"
          />
          <div className="flex flex-col">
            <h1 className="font-bold text-lg sm:text-2xl">Reservasi</h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
              Gunakan identitas pribadi yang valid untuk membuat janji temu.
              Setelah reservasi dikirim, jadwal tidak dapat diubah secara
              mandiri.
            </p>
          </div>
        </div>

        <FormReservasi />
      </div>
    </div>
  )
}
