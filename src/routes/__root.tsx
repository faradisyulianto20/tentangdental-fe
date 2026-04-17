import { useEffect, useState } from 'react'

import { QueryClientProvider } from '@tanstack/react-query'
import { createQueryClient } from '../lib/queryClient'

import {
  HeadContent,
  Navigate,
  Scripts,
  createRootRoute,
  useLocation,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import NotFound from '../components/error/NotFound'
import ErrorPage from '../components/error/ErrorPage'
import Pending from '../components/error/Pending'
import Footer from '../components/Footer'
import Header from '../components/Header'
import SidebarAdmin from '../components/admin/SidebarAdmin'
import { useAuth } from '@/hooks/useAuth'
import { initializeAuth } from '@/lib/auth-session'

import appCss from '../styles.css?url'

const THEME_INIT_SCRIPT = `(function(){try{var root=document.documentElement;root.classList.remove('light','dark');root.classList.add('light');root.setAttribute('data-theme','light');root.style.colorScheme='light';window.localStorage.setItem('theme','light');}catch(e){}})();`

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Tentang Dental',
      },
    ],
    links: [
      {
        rel: 'icon',
        href: '/logo.png',
        type: 'image/svg+xml',
      },
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  errorComponent: (props) => <ErrorPage {...props} />,
  pendingComponent: () => <Pending />,
  notFoundComponent: () => <NotFound />,
})

//
// interface RootErrorProps {
//   error: Error
//   info: {
//     componentStack: string
//   }
//   reset: () => void
// }

// Error component untuk menangani error di root route, seperti error saat fetch data user
// function RootErrorComponent({ error, reset }: RootErrorProps) {
//   return <ErrorPage error={error} resetError={reset} />
// }

function RootDocument({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => createQueryClient())
  const location = useLocation()
  const auth = useAuth()

  useEffect(() => {
    void initializeAuth()
  }, [])

  // Hide header/footer untuk auth routes
  const isAuthRoute = location.pathname.startsWith('/login')
  const isAdminRoute = location.pathname.startsWith('/admin')
  const showHeaderFooter = !isAuthRoute && !isAdminRoute
  const shouldBlockAdmin =
    isAdminRoute && auth.initialized && auth.status !== 'authenticated'
  const isCheckingAdminSession = isAdminRoute && !auth.initialized

  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
          <HeadContent />
        </head>
        <body className="antialiased" suppressHydrationWarning>
          {showHeaderFooter && <Header />}
          {isCheckingAdminSession ? (
            <Pending />
          ) : shouldBlockAdmin ? (
            <Navigate to="/login" replace />
          ) : isAdminRoute ? (
            <SidebarAdmin>{children}</SidebarAdmin>
          ) : (
            <div className={showHeaderFooter ? 'pt-16' : ''}>{children}</div>
          )}
          {showHeaderFooter && <Footer />}
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
          <Scripts />
        </body>
      </html>
    </QueryClientProvider>
  )
}
