import { createFileRoute } from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/layanan')({
  validateSearch: (search) => {
    return {
      id: search.id,
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { id } = Route.useSearch()

  const handleNavigate = (id: string) => {
    navigate({
      to: '/layanan',
      search: {
        id,
      },
    })
  }

  const layananFiltered = layanan.filter((item) => item.title !== id)

  return (
    <div className="w-full max-w-6xl flex justify-center flex-col items-center my-12 mx-auto">
      <h1 className="text-primary text-xl md:text-3xl font-bold">
        {artikel.title}
      </h1>
      <p className="text-muted-foreground text-sm md:text-base mt-3">
        {artikel.subtitle}
      </p>
      <div className="w-full my-12 rounded-xl max-w-290.75 h-111.75 overflow-hidden">
        <img
          src={artikel.imgPath}
          alt={artikel.title}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex flex-col md:flex-row w-full">
        <div
          className="prose prose-sm md:prose-base max-w-none text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: artikel.content }}
        />
        <div className="w-2/4">
          <h1 className="font-bold text-2xl">Layanan Lainnya</h1>
          <div className="flex flex-col gap-3 mt-6">
            {layananFiltered.map((item, index) => (
              <button
                onClick={() => handleNavigate(item.title)}
                key={index}
                className="flex items-left text-left gap-2 border px-4 py-2 border-primary rounded-lg cursor-pointer hover:shadow-md"
              >
                <img
                  src={`/${item.icon}`}
                  alt={item.title}
                  className="w-8 h-8"
                />
                <div>
                  <h2 className="text-base font-bold">{item.title}</h2>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const artikel = {
  title: 'Scaling',
  subtitle:
    'Scaling gigi adalah prosedur untuk membersihkan plak dan karang gigi. Prosedur ini perlu dilakukan secara rutin untuk mencegah kerusakan gigi dan gusi.',
  imgPath: 'berita1.png',
  content: `
    <h2>Apa itu Scaling Gigi?</h2>
    <p>
      Scaling gigi adalah prosedur untuk membersihkan atau menghilangkan karang (mineral yang mengeras) 
      yang menempel di garis gusi. Perawatan ini umum bisa kamu lakukan untuk melindungi enamel gigi 
      di bawah gusi dan jaringan gusi dari penyakit periodontal.
    </p>
    <p>
      Selain itu, dengan gigi dan gusi yang sehat, kamu juga bisa terhindar dari masalah mulut lainnya 
      dan kehilangan gigi.
    </p>
    <p>
      Prosedur ini juga sering dilakukan bersamaan dengan <strong>root planing</strong> atau kerap juga 
      disebut sebagai <em>deep cleaning</em>. Jika scaling menghilangkan karang dari permukaan gigi yang 
      terlihat saat tersenyum, root planing menghilangkan karang gigi dari akar gigi di bawah garis gusi.
    </p>

    <h2>Tujuan Scaling Gigi</h2>
    <p>Prosedur scaling memiliki beberapa tujuan, yaitu:</p>
    <ul>
      <li>Untuk menghilangkan plak dan karang dari area yang tidak dapat sikat gigi jangkau.</li>
      <li>Menghindari atau mencegah penyakit gusi.</li>
      <li>
        Mencegah pembentukan poket — kantong yang terbentuk ketika penumpukan plak terus menerus 
        menyebabkan gusi kehilangan kontak eratnya dengan gigi, yang mendukung lebih banyak plak 
        untuk disimpan. Semakin dalam kantong, semakin parah penyakit gusi berkembang.
      </li>
    </ul>
  `,
}

const layanan = [
  {
    title: 'Scaling',
    icon: 'gigi.svg',
  },
  {
    title: 'Oral Profilaksis',
    icon: 'gigi.svg',
  },
  {
    title: 'Tambal Gigi',
    icon: 'gigi.svg',
  },
  {
    title: 'Desentisasi Gigi',
    icon: 'gigi.svg',
  },
  {
    title: 'Perawatan Saluran Akar',
    icon: 'gigi.svg',
  },
  {
    title: 'Cabut Gigi',
    icon: 'gigi.svg',
  },
  {
    title: 'Perawatan Gigi Anak',
    icon: 'gigi.svg',
  },
  {
    title: 'Bleaching',
    icon: 'gigi.svg',
  },
  {
    title: 'Veneer',
    icon: 'gigi.svg',
  },
  {
    title: 'Aligner Gigi',
    icon: 'gigi.svg',
  },
  { title: 'Crown', icon: 'gigi.svg' },
  { title: 'Gigi Tiruan', icon: 'gigi.svg' },
]
