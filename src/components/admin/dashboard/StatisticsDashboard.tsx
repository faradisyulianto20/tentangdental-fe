import { ChartContainer } from '@/components/ui/chart'
import type { ChartConfig } from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts'

type ServiceAnalyticsItem = {
  service_name: string
  reservation_count: number
}

type StatisticsDashboardProps = {
  monthLabel: string
  services: ServiceAnalyticsItem[]
}

const chartConfig = {
  total: {
    label: 'Total Reservasi',
    color: '#1682B1',
  },
} satisfies ChartConfig

export default function StatisticsDashboard({
  monthLabel,
  services,
}: StatisticsDashboardProps) {
  const chartData = services.slice(0, 12).map((item) => ({
    service: item.service_name,
    total: item.reservation_count,
  }))

  return (
    <div className="bg-[#E0F4FB] rounded-lg p-4 md:p-6 space-y-4 md:space-y-6 my-6 w-full overflow-hidden shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-3xl font-bold text-[#0A4864]">
            Analitik Layanan
          </h2>
          <p className="text-sm md:text-base font-semibold">
            Periode {monthLabel}
          </p>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <div style={{ minWidth: 640 }}>
          <ChartContainer
            config={chartConfig}
            className="min-h-50 md:min-h-60 w-full"
          >
            <BarChart
              data={chartData}
              accessibilityLayer
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid horizontal vertical={false} stroke="#d1d5db" />
              <XAxis
                dataKey="service"
                tick={{ fontSize: 11 }}
                angle={-35}
                textAnchor="end"
                height={90}
                tickLine={false}
                axisLine={{ stroke: '#d1d5db' }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#d1d5db' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="total" fill={chartConfig.total.color} radius={2} />
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  )
}
