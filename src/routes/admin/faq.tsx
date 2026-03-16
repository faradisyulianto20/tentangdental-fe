import { FAQItem } from '@/components/beranda/FAQ'
import { Button } from '#/components/ui/button'
import { Field, FieldLabel } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/admin/faq')({
  component: RouteComponent,
})

function RouteComponent() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div>
      <div className='space-y-4'>
        <Field>
          <FieldLabel>Pertanyaan</FieldLabel>
          <Input placeholder="Masukkan pertanyaan" />
        </Field>
        <Field>
          <FieldLabel>Jawaban</FieldLabel>
          <Input placeholder="Masukkan jawaban" />
        </Field>
        <Button>Tambah FAQ</Button>
      </div>
      <div className="mt-4 space-y-4">
        {faqList.map((faq, index) => (
          <FAQItem
            key={index}
            item={faq}
            index={index}
            isOpen={openIndex === index}
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          />
        ))}
      </div>
    </div>
  )
}

const faqList = [
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
