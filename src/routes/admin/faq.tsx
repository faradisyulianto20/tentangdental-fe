import { FAQItem } from '@/components/beranda/FAQ'
import { Button } from '#/components/ui/button'
import { Field, FieldLabel } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Trash, Pencil, Check, X } from 'lucide-react'
import { Textarea } from '#/components/ui/textarea'

export const Route = createFileRoute('/admin/faq')({
  component: RouteComponent,
})

type FAQ = {
  pertanyaan: string
  jawaban: string
}

function RouteComponent() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [list, setList] = useState<FAQ[]>(faqList)
  const [editForm, setEditForm] = useState<FAQ>({ pertanyaan: '', jawaban: '' })
  const [newForm, setNewForm] = useState<FAQ>({ pertanyaan: '', jawaban: '' })

  const handleEditStart = (index: number) => {
    setEditIndex(index)
    setEditForm(list[index])
  }

  const handleEditSave = (index: number) => {
    setList(list.map((item, i) => (i === index ? editForm : item)))
    setEditIndex(null)
  }

  const handleEditCancel = () => {
    setEditIndex(null)
  }

  const handleDelete = (index: number) => {
    setList(list.filter((_, i) => i !== index))
    if (openIndex === index) setOpenIndex(null)
    if (editIndex === index) setEditIndex(null)
  }

  const handleAdd = () => {
    if (!newForm.pertanyaan || !newForm.jawaban) return
    setList([...list, newForm])
    setNewForm({ pertanyaan: '', jawaban: '' })
  }

  return (
    <div>
      {/* Form tambah */}
      <div className='space-y-4'>
        <Field>
          <FieldLabel>Pertanyaan</FieldLabel>
          <Input
            placeholder="Masukkan pertanyaan"
            value={newForm.pertanyaan}
            onChange={(e) => setNewForm({ ...newForm, pertanyaan: e.target.value })}
          />
        </Field>
        <Field>
          <FieldLabel>Jawaban</FieldLabel>
          <Textarea
            placeholder="Masukkan jawaban"
            className="resize-none"
            value={newForm.jawaban}
            onChange={(e) => setNewForm({ ...newForm, jawaban: e.target.value })}
          />
        </Field>
        <Button onClick={handleAdd}>Tambah FAQ</Button>
      </div>

      {/* List FAQ */}
      <div className="mt-6 space-y-4">
        {list.map((faq, index) => (
          <div key={index} className="border rounded-lg overflow-hidden">
            {editIndex === index ? (
              // Mode edit
              <div className="p-4 space-y-3">
                <Field>
                  <FieldLabel>Pertanyaan</FieldLabel>
                  <Input
                    value={editForm.pertanyaan}
                    onChange={(e) => setEditForm({ ...editForm, pertanyaan: e.target.value })}
                  />
                </Field>
                <Field>
                  <FieldLabel>Jawaban</FieldLabel>
                  <Textarea
                    className="resize-none"
                    value={editForm.jawaban}
                    onChange={(e) => setEditForm({ ...editForm, jawaban: e.target.value })}
                  />
                </Field>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleEditSave(index)}>
                    <Check className="w-4 h-4 mr-1" /> Simpan
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleEditCancel}>
                    <X className="w-4 h-4 mr-1" /> Batal
                  </Button>
                </div>
              </div>
            ) : (
              // Mode tampil
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <FAQItem
                    item={faq}
                    index={index}
                    isOpen={openIndex === index}
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  />
                </div>
                <div className="flex gap-1 p-3 shrink-0">
                  <button
                    onClick={() => handleEditStart(index)}
                    className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-destructive"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const faqList: FAQ[] = [
  {
    pertanyaan: 'Apakah Tentang Dental menerima pasien baru?',
    jawaban: 'Ya, kami dengan senang hati menerima pasien baru. Anda dapat menghubungi kami untuk membuat janji atau konsultasi.',
  },
  {
    pertanyaan: 'Apa saja layanan yang ditawarkan oleh Tentang Dental?',
    jawaban: 'Kami menawarkan berbagai layanan perawatan gigi, termasuk pemeriksaan rutin, pembersihan, perawatan saluran akar, pemasangan gigi palsu, dan banyak lagi.',
  },
  {
    pertanyaan: 'Apakah Tentang Dental menerima asuransi kesehatan?',
    jawaban: 'Ya, kami menerima berbagai jenis asuransi kesehatan. Silakan hubungi kami untuk informasi lebih lanjut tentang asuransi yang kami terima.',
  },
  {
    pertanyaan: 'Bagaimana cara membuat janji dengan Tentang Dental?',
    jawaban: 'Anda dapat membuat janji dengan menghubungi kami melalui telepon, email, atau menggunakan formulir online di situs web kami.',
  },
]