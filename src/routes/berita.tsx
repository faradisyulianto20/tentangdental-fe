import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/berita')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="w-full max-w-6xl mx-auto flex justify-center flex-col items-center mx-6">
      <div className="w-full my-12 rounded-xl max-w-[1163px] h-[447px] overflow-hidden">
        <img
          src={berita.imgPath}
          alt={berita.title}
          className="object-cover w-full h-full"
        />
      </div>
      <div className='text-left w-full'>
        <h1 className="text-xl md:text-3xl font-bold">
          {berita.title}
        </h1>
        <p className="text-muted-foreground text-sm md:text-base mt-3">
          {berita.penulis} - {berita.tanggal}
        </p>
      </div>
      <div className="flex flex-col md:flex-row w-full my-6">
        <div
          className="prose prose-sm md:prose-base max-w-none text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: berita.content }}
        />
      </div>
    </div>
  )
}

const berita = {
  title: 'Apa Pentingnya Menjaga Kesehatan Gigi?',
  penulis: 'Dr. John Doe',
  tanggal: '12 Oktober 2023',
  subtitle:
    'Menjaga kesehatan gigi sangat penting untuk kesehatan secara keseluruhan. Gigi yang sehat tidak hanya membantu dalam mengunyah makanan dengan baik, tetapi juga berperan dalam menjaga kesehatan mulut dan mencegah berbagai masalah kesehatan lainnya.',
  imgPath: 'berita1.png',
  content: `
        <p>Menjaga kesehatan gigi melibatkan beberapa langkah penting, seperti menyikat gigi secara teratur, menggunakan benang gigi, dan rutin memeriksakan gigi ke dokter gigi. Dengan melakukan perawatan yang tepat, kita dapat mencegah kerusakan gigi, infeksi, dan masalah kesehatan mulut lainnya.</p>
        <p>Selain itu, menjaga kesehatan gigi juga dapat meningkatkan kepercayaan diri dan kualitas hidup. Gigi yang sehat dapat memberikan senyuman yang indah dan membantu dalam berkomunikasi dengan lebih baik.</p>
        <p>Oleh karena itu, penting bagi kita untuk memberikan perhatian khusus pada kesehatan gigi dan mulut kita. Dengan menjaga kebersihan gigi dan rutin memeriksakan gigi, kita dapat memastikan bahwa gigi kita tetap sehat dan kuat sepanjang hidup.</p>
    `,
}
