import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { LogOut } from 'lucide-react'
import { useLocation } from '@tanstack/react-router'

export function AppSidebar({navigations }: { navigations: { name: string; url: string; icon: React.ComponentType }[] }) {
  const { pathname } = useLocation()

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center flex-row p-4">
        <img src="/logo.svg" alt="Logo" className="w-8 h-8 mr-2" />
        <span className="text-lg font-semibold">Tentang Dental</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="p-0">
          <SidebarMenu>
            {navigations.map((menu) => (
              <SidebarMenuItem
                key={menu.name}
              >
                <SidebarMenuButton
                  asChild
                  className={`h-10 px-4 hover:bg-[#0A4864] hover:text-white rounded-none font-semibold ${
                    pathname === menu.url ? 'bg-[#0A4864] text-white' : ''
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
