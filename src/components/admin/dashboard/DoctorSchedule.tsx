export default function DoctorSchedule() {
  const now = new Date()
  const formattedDate = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  return (
    <div className="p-4 shadow-md rounded-lg">
      <div>
        <h1 className="text-2xl font-bold">Jadwal Dokter</h1>
        <p className="text-sm text-muted-foreground">{formattedDate}</p>
      </div>
      <div className="mt-4">
        {doctorSchedules.map((schedule, index) => (
          <div key={index} className="border rounded-lg p-4 mb-4 bg-[#E0F4FB] flex gap-2">
            <img
              src={schedule.imgUrl}
              alt={schedule.namaDokter}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h2 className="text-lg font-bold">{schedule.namaDokter}</h2>
              <p className="text-sm text-muted-foreground">{schedule.jamKerja}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const doctorSchedules = [
  {
    imgUrl: 'dokter.png',
    namaDokter: 'Dr. Smith',
    jamKerja: '08:00 - 16:00',
  },
  {
    imgUrl: 'dokter.png',
    namaDokter: 'Dr. Johnson',
    jamKerja: '10:00 - 18:00',
  },
  {
    imgUrl: 'dokter.png',
    namaDokter: 'Dr. Lee',
    jamKerja: '09:00 - 17:00',
  },
]
