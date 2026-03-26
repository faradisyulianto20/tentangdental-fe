import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { LogOut, X } from 'lucide-react'
import { useLocation } from '@tanstack/react-router'

export function AppSidebar({
  navigations,
}: {
  navigations: { name: string; url: string; icon: React.ComponentType }[]
}) {
  const { pathname } = useLocation()
  const { toggleSidebar } = useSidebar()

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between flex-row p-4">
        <div className="flex items-center">
          <img src="/logo.svg" alt="Logo" className="w-8 h-8 mr-2" />
          <span className="md:text-lg font-semibold">Tentang Dental</span>
        </div>
        <button
          onClick={() => toggleSidebar()}
          className="md:hidden p-1 hover:bg-gray-200 rounded transition-colors"
        >
          <X size={24} />
        </button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="p-0">
          <SidebarMenu>
            {navigations.map((menu) => (
              <SidebarMenuItem key={menu.name}>
                <SidebarMenuButton
                  asChild
                  className={`h-10 px-4 hover:bg-[#10658B] hover:text-white rounded-none font-semibold ${
                    pathname === menu.url ? 'bg-[#0A4864] text-white hover:bg-[#0A4864]' : ''
                  }`}
                >
                  <a href={menu.url} className="w-full flex items-center gap-2">
                    <menu.icon />
                    <span>{menu.name}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="bg-[#A2C341] text-white font-bold hover:bg-[#A2C341]/80 hover:text-white cursor-pointer active:bg-[#A2C341]/80 active:text-white/80">
              <LogOut /> Logout
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
