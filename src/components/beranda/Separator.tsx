import { Button } from '../ui/button'

export default function Separator() {
  return (
    <div className="bg-gradient-to-r from-[#01C8FF] to-[#6DDFFF] flex items-center justify-between gap-2 p-6 rounded-xl">
      <h1 className="text-3xl font-bold text-white">
        Konsultasi kesehatan dan mulutmu
      </h1>
      <Button variant={'outline'}>Reservasi Sekarang</Button>
    </div>
  )
}
