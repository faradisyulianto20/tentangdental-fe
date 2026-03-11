import { useState } from 'react'
import { ChevronRight } from 'lucide-react'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="w-full max-w-6xl">
      <div className="text-center my-12">
        <h1 className="text-primary text-3xl font-bold">
          Pertanyaan yang Sering Ditanyakan
        </h1>
        <p className="text-muted-foreground">
          Temukan jawaban atas pertanyaan umum seputar perencanaan UMKM
        </p>
      </div>
      <div className="flex flex-col gap-2 w-full my-6">
        {faq.map((item, index) => (
          <div
            className="p-4 rounded-lg border border-primary w-full flex flex-col gap-2 text-primary cursor-pointer"
            key={index}
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <div className="flex justify-between">

            <p className="font-bold">{item.pertanyaan}</p>
             {openIndex === index ? (
                <ChevronRight className="text-muted-foreground rotate-90" />
            ) : (
                <ChevronRight className="text-muted-foreground" />
            )}
            
            </div>
            {openIndex === index && (
              <p className="text-muted-foreground">{item.jawaban}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const faq = [
  {
    pertanyaan: 'Apakah Tentang Dental menerima pasien baru?',
    jawaban:
      'Ya, kami dengan senang hati menerima pasien baru. Anda dapat menghubungi kami untuk membuat janji atau konsultasi.',
  },
  {
    pertanyaan: 'Apa saja layanan yang ditawarkan oleh Tentang Dental?',
    jawaban:
      'Kami menawarkan berbagai layanan perawatan gigi, termasuk pemeriksaan rutin, pembersihan, perawatan saluran akar, pemasangan gigi palsu, dan banyak lagi.',
  },
  {
    pertanyaan: 'Apakah Tentang Dental menerima asuransi kesehatan?',
    jawaban:
      'Ya, kami menerima berbagai jenis asuransi kesehatan. Silakan hubungi kami untuk informasi lebih lanjut tentang asuransi yang kami terima.',
  },
  {
    pertanyaan: 'Bagaimana cara membuat janji dengan Tentang Dental?',
    jawaban:
      'Anda dapat membuat janji dengan menghubungi kami melalui telepon, email, atau menggunakan formulir online di situs web kami.',
  },
]
