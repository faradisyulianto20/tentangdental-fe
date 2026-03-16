import { Users, UserCheck, UserX } from 'lucide-react'

const content = [
  {
    icon: Users,
    title: 'Reservasi Pasien',
    total: 120,
  },
  {
    icon: UserCheck,
    title: 'Pasien Hadir',
    total: 120,
  },
  {
    icon: UserX,
    title: 'Pasien Tidak Hadir',
    total: 120,
  },
]

export default function CardDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {content.map((item, index) => (
        <div key={index} className="bg-[#E0F4FB] rounded-lg shadow p-4">
          <div className="flex items-center gap-4">
            <div className="bg-primary rounded-full p-2">
              <item.icon className="text-white w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-bold ">{item.total}</p>
              <p className=" text-sm text-[#67483E]">
                {item.title}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
