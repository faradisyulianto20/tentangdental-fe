import { useState } from 'react'

import { QueryClientProvider } from '@tanstack/react-query'
import { createQueryClient } from '../lib/queryClient'

import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import NotFound from '../components/error/NotFound'
import ErrorPage from '../components/error/ErrorPage'
import Pending from '../components/error/Pending'
import Footer from '../components/Footer'
import Header from '../components/Header'

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

interface RootErrorProps {
  error: Error
  info: {
    componentStack: string
  }
  reset: () => void
}

function RootErrorComponent({ error, reset }: RootErrorProps) {
  return <ErrorPage error={error} resetError={reset} />
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => createQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
          <HeadContent />
        </head>
        <body className="font-sans antialiased" suppressHydrationWarning>
          <Header />
          <div className="pt-16">{children}</div>
          <Footer />
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
