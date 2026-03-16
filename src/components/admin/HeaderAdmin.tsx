import { useLocation } from '@tanstack/react-router'

export default function HeaderAdmin({navigations}: {navigations: {name: string, url: string}[]}) {
  const { pathname } = useLocation()

  return (
    <header className="bg-white p-3 px-6 flex justify-between items-center shadow-sm">
      <h1 className="text-2xl font-bold">
        {navigations.find((nav) => nav.url === pathname)?.name || 'Dashboard'}
      </h1>
      <div className="">
        <h1 className="text-base font-bold">Ahmad Prasetya</h1>
        <p className="text-xs">Admin Klink</p>
      </div>
    </header>
  )
}