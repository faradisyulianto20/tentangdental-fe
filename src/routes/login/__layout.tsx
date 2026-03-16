import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/login/__layout')({
  component: AuthLayout,
})

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Auth pages tanpa Header/Footer hanya Outlet */}
      <main className="flex-1 flex items-center justify-center w-full">
        <Outlet />
      </main>
    </div>
  )
}
