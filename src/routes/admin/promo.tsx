import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { PromoCard } from "@/components/beranda/Promo"
import PromoForm from '@/components/admin/promo/PromoForm'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { FieldGroup, FieldSet, Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FileUpload } from '@/components/ui/file-upload'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Undo, Redo } from 'lucide-react'

export const Route = createFileRoute('/admin/promo')({
  component: RouteComponent,
})

function TiptapEditor({ content }: { content?: string }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editorProps: {
      attributes: {
        class: 'min-h-32 px-3 py-2 text-sm focus:outline-none [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:text-xl [&_h3]:font-bold',
      },
    },
  })

  if (!editor) return null

  const tools = [
    { icon: <Bold size={14} />, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold'), title: 'Bold' },
    { icon: <Italic size={14} />, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic'), title: 'Italic' },
    { icon: <Heading2 size={14} />, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }), title: 'Heading 2' },
    { icon: <Heading3 size={14} />, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive('heading', { level: 3 }), title: 'Heading 3' },
    { icon: <List size={14} />, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList'), title: 'Bullet List' },
    { icon: <ListOrdered size={14} />, action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive('orderedList'), title: 'Ordered List' },
    { icon: <Undo size={14} />, action: () => editor.chain().focus().undo().run(), active: false, title: 'Undo' },
    { icon: <Redo size={14} />, action: () => editor.chain().focus().redo().run(), active: false, title: 'Redo' },
  ]

  return (
    <div className="rounded-md border border-input overflow-hidden">
      <div className="flex flex-wrap gap-1 border-b border-input p-2 bg-muted/40">
        {tools.map((tool) => (
          <button
            key={tool.title}
            type="button"
            title={tool.title}
            onClick={tool.action}
            className={`p-1.5 rounded hover:bg-muted transition-colors ${tool.active ? 'bg-muted text-primary' : 'text-muted-foreground'}`}
          >
            {tool.icon}
          </button>
        ))}
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}

function RouteComponent() {
  const [selectedPromo, setSelectedPromo] = useState<Promo | null>(null)

  return (
    <div>
      <PromoForm />
      <div className='flex flex-wrap gap-6 justify-center'>
        {promos.map((promo, index) => (
          <div key={index} onClick={() => setSelectedPromo(promo)} className="cursor-pointer">
            <PromoCard promo={promo} variants={null} />
          </div>
        ))}
      </div>

      <Dialog open={!!selectedPromo} onOpenChange={(open) => !open && setSelectedPromo(null)}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <form className="space-y-4">
            <FieldGroup>
              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FileUpload label="Unggah Gambar Promo" />
                  </Field>
                  <Field>
                    <FieldLabel>Judul Promo</FieldLabel>
                    <Input
                      type="text"
                      placeholder="Masukkan Judul Promo"
                      defaultValue={selectedPromo?.judul}
                    />
                  </Field>
                  <FieldGroup className='grid grid-cols-2'>
                    <Field>
                      <FieldLabel>Harga Awal</FieldLabel>
                      <Input
                        type="number"
                        placeholder="Masukkan Harga Awal"
                        defaultValue={selectedPromo?.hargaAwal}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Harga Diskon</FieldLabel>
                      <Input
                        type="number"
                        placeholder="Masukkan Harga Diskon"
                        defaultValue={selectedPromo?.hargaDiskon}
                      />
                    </Field>
                  </FieldGroup>
                  <Field>
                    <FieldLabel>Deskripsi Promo</FieldLabel>
                    <TiptapEditor content={selectedPromo?.description} />
                  </Field>
                </FieldGroup>
              </FieldSet>
              <DialogFooter className="gap-2">
                <DialogClose asChild>
                  <Button variant="outline">Batal</Button>
                </DialogClose>
                <Button type="button" className='bg-red-400 hover:bg-red-500'>Hapus Promo</Button>
                <Button type="submit" className="bg-[#B9D654] text-white hover:bg-[#A8C24A]">
                  Simpan Perubahan
                </Button>
              </DialogFooter>
            </FieldGroup>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

type Promo = {
  judul: string
  imgUrl: string
  hargaAwal: number
  hargaDiskon: number
  description: string
}

const promos: Promo[] = [
  {
    judul: 'PSA (Paket)',
    imgUrl: '/hero.png',
    hargaAwal: 4200000,
    hargaDiskon: 3000000,
    description: `
      <div class="text-xs text-left">
        <p class="mb-1">Paket perawatan saluran akar untuk membersihkan infeksi dan menjaga kesehatan gigi.</p>
        <ul class="list-disc pl-4 space-y-1">
          <li>Pembersihan Saluran Akar</li>
          <li>Pengisian Saluran Akar</li>
          <li>Tambalan Sementara</li>
          <li>Konsultasi Dokter</li>
        </ul>
      </div>`,
  },
  {
    judul: 'PSA (Paket)',
    imgUrl: '/hero.png',
    hargaAwal: 4200000,
    hargaDiskon: 3000000,
    description: `
      <div class="text-xs text-left">
        <p class="mb-1">Paket perawatan saluran akar untuk membersihkan infeksi dan menjaga kesehatan gigi.</p>
        <ul class="list-disc pl-4 space-y-1">
          <li>Pembersihan Saluran Akar</li>
          <li>Pengisian Saluran Akar</li>
          <li>Tambalan Sementara</li>
          <li>Konsultasi Dokter</li>
        </ul>
      </div>`,
  },
  {
    judul: 'PSA (Paket)',
    imgUrl: '/hero.png',
    hargaAwal: 4200000,
    hargaDiskon: 3000000,
    description: `
      <div class="text-xs text-left">
        <p class="mb-1">Paket perawatan saluran akar untuk membersihkan infeksi dan menjaga kesehatan gigi.</p>
        <ul class="list-disc pl-4 space-y-1">
          <li>Pembersihan Saluran Akar</li>
          <li>Pengisian Saluran Akar</li>
          <li>Tambalan Sementara</li>
          <li>Konsultasi Dokter</li>
        </ul>
      </div>`,
  },
  {
    judul: 'PSA (Paket)',
    imgUrl: '/hero.png',
    hargaAwal: 4200000,
    hargaDiskon: 3000000,
    description: `
      <div class="text-xs text-left">
        <p class="mb-1">Paket perawatan saluran akar untuk membersihkan infeksi dan menjaga kesehatan gigi.</p>
        <ul class="list-disc pl-4 space-y-1">
          <li>Pembersihan Saluran Akar</li>
          <li>Pengisian Saluran Akar</li>
          <li>Tambalan Sementara</li>
          <li>Konsultasi Dokter</li>
        </ul>
      </div>`,
  },
  {
    judul: 'PSA (Paket)',
    imgUrl: '/hero.png',
    hargaAwal: 4200000,
    hargaDiskon: 3000000,
    description: `
      <div class="text-xs text-left">
        <p class="mb-1">Paket perawatan saluran akar untuk membersihkan infeksi dan menjaga kesehatan gigi.</p>
        <ul class="list-disc pl-4 space-y-1">
          <li>Pembersihan Saluran Akar</li>
          <li>Pengisian Saluran Akar</li>
          <li>Tambalan Sementara</li>
          <li>Konsultasi Dokter</li>
        </ul>
      </div>`,
  },
]
