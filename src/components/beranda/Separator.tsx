import { Button } from '../ui/button'

export default function Separator() {
  return (
    <div className="bg-linear-to-r from-[#01C8FF] to-[#6DDFFF] p-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-2 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white">
          Konsultasi kesehatan dan mulutmu
        </h1>
        <Button variant={'default'} className="bg-white hover:bg-white/80 text-primary shadow-md">Reservasi Sekarang</Button>
      </div>
    </div>
  )
}
