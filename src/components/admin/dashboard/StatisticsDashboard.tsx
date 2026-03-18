import { useState } from 'react'
import { ChartContainer, type ChartConfig } from '@/components/ui/chart'
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const monthsData = [
  {
    month: 'Januari',
    data: [
      {
        service: 'Scaling',
        jmlReservasi: 100,
        jmlHadir: 100,
        jmlTertangani: 250,
      },
      {
        service: 'Oral Prof',
        jmlReservasi: 100,
        jmlHadir: 300,
        jmlTertangani: 150,
      },
      {
        service: 'Tambal',
        jmlReservasi: 50,
        jmlHadir: 150,
        jmlTertangani: 100,
      },
      {
        service: 'Desensitasi',
        jmlReservasi: 250,
        jmlHadir: 100,
        jmlTertangani: 50,
      },
      { service: 'PSA', jmlReservasi: 50, jmlHadir: 200, jmlTertangani: 250 },
      {
        service: 'Cabut',
        jmlReservasi: 100,
        jmlHadir: 150,
        jmlTertangani: 100,
      },
      {
        service: 'Gigi anak',
        jmlReservasi: 100,
        jmlHadir: 100,
        jmlTertangani: 50,
      },
      {
        service: 'Bleaching',
        jmlReservasi: 200,
        jmlHadir: 100,
        jmlTertangani: 100,
      },
      {
        service: 'Veneer',
        jmlReservasi: 150,
        jmlHadir: 100,
        jmlTertangani: 100,
      },
      {
        service: 'Aligner',
        jmlReservasi: 150,
        jmlHadir: 100,
        jmlTertangani: 150,
      },
      {
        service: 'Crown',
        jmlReservasi: 100,
        jmlHadir: 100,
        jmlTertangani: 100,
      },
      {
        service: 'Gigi Tiruan',
        jmlReservasi: 300,
        jmlHadir: 150,
        jmlTertangani: 200,
      },
    ],
  },
  {
    month: 'Februari',
    data: [
      {
        service: 'Scaling',
        jmlReservasi: 120,
        jmlHadir: 110,
        jmlTertangani: 260,
      },
      {
        service: 'Oral Prof',
        jmlReservasi: 110,
        jmlHadir: 310,
        jmlTertangani: 160,
      },
      {
        service: 'Tambal',
        jmlReservasi: 60,
        jmlHadir: 160,
        jmlTertangani: 110,
      },
      {
        service: 'Desensitasi',
        jmlReservasi: 260,
        jmlHadir: 110,
        jmlTertangani: 60,
      },
      { service: 'PSA', jmlReservasi: 60, jmlHadir: 210, jmlTertangani: 260 },
      {
        service: 'Cabut',
        jmlReservasi: 110,
        jmlHadir: 160,
        jmlTertangani: 110,
      },
      {
        service: 'Gigi anak',
        jmlReservasi: 110,
        jmlHadir: 110,
        jmlTertangani: 60,
      },
      {
        service: 'Bleaching',
        jmlReservasi: 210,
        jmlHadir: 110,
        jmlTertangani: 110,
      },
      {
        service: 'Veneer',
        jmlReservasi: 160,
        jmlHadir: 110,
        jmlTertangani: 110,
      },
      {
        service: 'Aligner',
        jmlReservasi: 160,
        jmlHadir: 110,
        jmlTertangani: 160,
      },
      {
        service: 'Crown',
        jmlReservasi: 110,
        jmlHadir: 110,
        jmlTertangani: 110,
      },
      {
        service: 'Gigi Tiruan',
        jmlReservasi: 310,
        jmlHadir: 160,
        jmlTertangani: 210,
      },
    ],
  },
  {
    month: 'Maret',
    data: [
      {
        service: 'Scaling',
        jmlReservasi: 100,
        jmlHadir: 100,
        jmlTertangani: 250,
      },
      {
        service: 'Oral Prof',
        jmlReservasi: 100,
        jmlHadir: 300,
        jmlTertangani: 150,
      },
      {
        service: 'Tambal',
        jmlReservasi: 50,
        jmlHadir: 150,
        jmlTertangani: 100,
      },
      {
        service: 'Desensitasi',
        jmlReservasi: 250,
        jmlHadir: 100,
        jmlTertangani: 50,
      },
      { service: 'PSA', jmlReservasi: 50, jmlHadir: 200, jmlTertangani: 250 },
      {
        service: 'Cabut',
        jmlReservasi: 100,
        jmlHadir: 150,
        jmlTertangani: 100,
      },
      {
        service: 'Gigi anak',
        jmlReservasi: 100,
        jmlHadir: 100,
        jmlTertangani: 50,
      },
      {
        service: 'Bleaching',
        jmlReservasi: 200,
        jmlHadir: 100,
        jmlTertangani: 100,
      },
      {
        service: 'Veneer',
        jmlReservasi: 150,
        jmlHadir: 100,
        jmlTertangani: 100,
      },
      {
        service: 'Aligner',
        jmlReservasi: 150,
        jmlHadir: 100,
        jmlTertangani: 150,
      },
      {
        service: 'Crown',
        jmlReservasi: 100,
        jmlHadir: 100,
        jmlTertangani: 100,
      },
      {
        service: 'Gigi Tiruan',
        jmlReservasi: 300,
        jmlHadir: 150,
        jmlTertangani: 200,
      },
    ],
  },
]

const chartConfig = {
  jmlReservasi: {
    label: 'Jumlah Reservasi Pasien',
    color: '#4A4A4A',
  },
  jmlHadir: {
    label: 'Jumlah Pasien yang hadir',
    color: '#B88476',
  },
  jmlTertangani: {
    label: 'Jumlah Pasien yang sudah ditangani',
    color: '#1682B1',
  },
} satisfies ChartConfig

export default function StatisticsDashboard() {
  const [monthIndex, setMonthIndex] = useState(2) // Default Maret
  const currentMonthData = monthsData[monthIndex]

  const nextMonth = () => {
    setMonthIndex((prev) => (prev + 1) % monthsData.length)
  }

  const prevMonth = () => {
    setMonthIndex((prev) => (prev - 1 + monthsData.length) % monthsData.length)
  }

  return (
    <div className="bg-[#E0F4FB] rounded-lg p-4 md:p-6 space-y-4 md:space-y-6 my-6 w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#0A4864]">
            Laporan Pasien
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            Bulan {currentMonthData.month} 2026
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={prevMonth}
            className="bg-[#B9D654] hover:bg-[#A8C44A] text-white p-2 rounded-full transition-colors cursor-pointer"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextMonth}
            className="bg-[#B9D654] hover:bg-[#A8C44A] text-white p-2 rounded-full transition-colors cursor-pointer"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-auto min-h-70 md:min-h-100 overflow-x-auto">
        <ChartContainer
          config={chartConfig}
          className="min-h-70 md:min-h-100 w-full"
        >
          <BarChart
            data={currentMonthData.data}
            accessibilityLayer
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              horizontal={true}
              vertical={false}
              stroke="#d1d5db"
            />
            <XAxis
              dataKey="service"
              tick={{ fontSize: 11 }}
              angle={-45}
              textAnchor="end"
              height={100}
              tickLine={false}
              axisLine={{ stroke: '#d1d5db' }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: '#d1d5db' }}
              domain={[0, 400]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="square"
              formatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <Bar
              dataKey="jmlReservasi"
              fill={chartConfig.jmlReservasi.color}
              radius={2}
            />
            <Bar
              dataKey="jmlHadir"
              fill={chartConfig.jmlHadir.color}
              radius={2}
            />
            <Bar
              dataKey="jmlTertangani"
              fill={chartConfig.jmlTertangani.color}
              radius={2}
            />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  )
}
