import { createFileRoute, Outlet } from '@tanstack/react-router'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/admin/AppSidebar'
import HeaderAdmin from '@/components/admin/HeaderAdmin'
import { AdminTitleProvider, useAdminTitle } from '@/contexts/AdminTitleContext'

export const Route = createFileRoute('/admin/__layout')({
  component: AdminLayoutComponent,
})

function AdminLayoutComponent() {
  return (
    <AdminTitleProvider>
      <AdminLayoutContent />
    </AdminTitleProvider>
  )
}

function AdminLayoutContent() {
  const { title } = useAdminTitle()

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <HeaderAdmin title={title} />
          <main className="flex-1 overflow-auto bg-gray-50">
            <div className="p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
