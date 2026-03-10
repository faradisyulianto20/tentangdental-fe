import { createFileRoute } from '@tanstack/react-router'
import Heroes from '../components/beranda/Heroes'
export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div className='max-w-310 flex flex-col items-center justify-center mx-auto'>
      <Heroes />
    </div>
  )
}
