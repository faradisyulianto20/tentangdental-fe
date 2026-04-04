import { useLocation } from '@tanstack/react-router'
import { useAuth } from '@/hooks/useAuth'

export default function HeaderAdmin({
  navigations,
}: {
  navigations: { name: string; url: string }[]
}) {
  const { pathname } = useLocation()
  const auth = useAuth()

  const adminName = auth.user?.name || 'Admin'
  const adminRole = auth.user?.role || 'admin'

  return (
    <header className="bg-white p-3 px-6 flex justify-between items-center shadow-sm">
      <h1 className="text-2xl font-bold">
        {navigations.find((nav) => nav.url === pathname)?.name || 'Dashboard'}
      </h1>
      <div className="">
        <h1 className="text-base font-bold">{adminName}</h1>
        <p className="text-xs capitalize">{adminRole}</p>
      </div>
    </header>
  )
}
