import { createFileRoute } from '@tanstack/react-router'
import { ArtikelCard } from '@/components/beranda/Artikel'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { FieldSet, FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FileUpload } from '#/components/ui/file-upload'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Undo, Redo } from 'lucide-react'

export const Route = createFileRoute('/admin/artikel')({
  component: RouteComponent,
})

type Artikel = {
  title: string
  subtitle: string
  imgPath: string
  penulis?: string
}

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

function ArtikelForm() {
  return (
    <FieldSet>
      <Field className="grid w-full items-center gap-4">
        <FieldLabel>Gambar Artikel</FieldLabel>
        <FileUpload />
      </Field>
      <Field className="grid w-full items-center gap-4">
        <FieldLabel>Judul Artikel</FieldLabel>
        <Input id="judul" placeholder="Masukkan judul artikel" />
      </Field>
      <Field className="grid w-full items-center gap-4">
        <FieldLabel htmlFor="penulis">Penulis</FieldLabel>
        <Input id="penulis" placeholder="Masukkan nama penulis" />
      </Field>
      <Field className="grid w-full items-center gap-4">
        <FieldLabel htmlFor="konten">Konten Artikel</FieldLabel>
        <TiptapEditor />
      </Field>
      <Field orientation="horizontal">
        <Button type="submit">Tambahkan Artikel</Button>
      </Field>
    </FieldSet>
  )
}

function RouteComponent() {
  const [selectedArtikel, setSelectedArtikel] = useState<Artikel | null>(null)

  return (
    <div>
      <ArtikelForm />
      <div className="flex flex-wrap justify-center gap-6 mt-6">
        {artikelList.map((item, index) => (
          <div key={index} onClick={() => setSelectedArtikel(item)} className="cursor-pointer">
            <ArtikelCard artikel={item} />
          </div>
        ))}
      </div>

      <Dialog open={!!selectedArtikel} onOpenChange={(open) => !open && setSelectedArtikel(null)}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <form className="space-y-4">
            <FieldGroup>
              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FieldLabel>Gambar Artikel</FieldLabel>
                    <FileUpload label="Unggah Gambar Artikel" />
                  </Field>
                  <Field>
                    <FieldLabel>Judul Artikel</FieldLabel>
                    <Input
                      type="text"
                      placeholder="Masukkan Judul Artikel"
                      defaultValue={selectedArtikel?.title}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Penulis</FieldLabel>
                    <Input
                      type="text"
                      placeholder="Masukkan Nama Penulis"
                      defaultValue={selectedArtikel?.penulis}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Konten Artikel</FieldLabel>
                    <TiptapEditor />
                  </Field>
                </FieldGroup>
              </FieldSet>
              <DialogFooter className="gap-2">
                <DialogClose asChild>
                  <Button variant="outline">Batal</Button>
                </DialogClose>
                <Button type="button" className='bg-red-400 hvoer:bg-red-500'>Hapus Artikel</Button>
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

const artikelList: Artikel[] = [
  {
    title: 'Pentingnya Perawatan Gigi Rutin untuk Kesehatan Mulut',
    subtitle: 'Perawatan gigi rutin sangat penting untuk menjaga kesehatan mulut dan mencegah masalah gigi yang serius. Berikut adalah beberapa alasan mengapa perawatan gigi rutin sangat penting.',
    imgPath: '/berita1.png',
    penulis: 'Admin',
  },
  {
    title: 'Pentingnya Perawatan Gigi Rutin untuk Kesehatan Mulut',
    subtitle: 'Perawatan gigi rutin sangat penting untuk menjaga kesehatan mulut dan mencegah masalah gigi yang serius. Berikut adalah beberapa alasan mengapa perawatan gigi rutin sangat penting.',
    imgPath: '/berita1.png',
    penulis: 'Admin',
  },
  {
    title: 'Pentingnya Perawatan Gigi Rutin untuk Kesehatan Mulut',
    subtitle: 'Perawatan gigi rutin sangat penting untuk menjaga kesehatan mulut dan mencegah masalah gigi yang serius. Berikut adalah beberapa alasan mengapa perawatan gigi rutin sangat penting.',
    imgPath: '/berita1.png',
    penulis: 'Admin',
  },
  {
    title: 'Pentingnya Perawatan Gigi Rutin untuk Kesehatan Mulut',
    subtitle: 'Perawatan gigi rutin sangat penting untuk menjaga kesehatan mulut dan mencegah masalah gigi yang serius. Berikut adalah beberapa alasan mengapa perawatan gigi rutin sangat penting.',
    imgPath: '/berita1.png',
    penulis: 'Admin',
  },
]