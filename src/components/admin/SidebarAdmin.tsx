import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/admin/AppSidebar'
import HeaderAdmin from './HeaderAdmin'
import { LayoutDashboard, HelpCircle, Stethoscope, Newspaper, Tag, UserRound, Images, MessageSquareQuote, ClipboardList, Calendar } from 'lucide-react'

const navigations = [
  { name: 'Dashboard',     url: '/admin',                icon: LayoutDashboard },
  { name: 'FAQ',           url: '/admin/faq',             icon: HelpCircle },
  { name: 'Layanan',       url: '/admin/layanan',         icon: Stethoscope },
  { name: 'Reservasi',     url: '/admin/reservasi',       icon: Calendar },
  { name: 'Artikel',       url: '/admin/artikel',         icon: Newspaper },
  { name: 'Promo',         url: '/admin/promo',           icon: Tag },
  { name: 'Profil Dokter', url: '/admin/profil-dokter',   icon: UserRound },
  { name: 'Galeri',        url: '/admin/galeri',          icon: Images },
  { name: 'Testimoni',     url: '/admin/testimoni',       icon: MessageSquareQuote },
  { name: 'Data Pasien',   url: '/admin/data-pasien',     icon: ClipboardList },
]

export default function SidebarAdmin({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar navigations={navigations} />
      <main className='w-full'>
        {/* <SidebarTrigger /> */}
        <HeaderAdmin navigations={navigations} />
        <div className="p-4 w-full">{children}</div>
      </main>
    </SidebarProvider>
  ) 
}
