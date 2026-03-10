import { createFileRoute } from '@tanstack/react-router'
import Heroes from '../components/beranda/Heroes'
import Testimoni from '../components/beranda/Testimoni'
export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div className='max-w-7xl px-6 flex flex-col items-center justify-center mx-auto'>
      <Heroes />
      <Testimoni />
    </div>
  )
}
