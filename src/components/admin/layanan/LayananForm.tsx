import { FieldGroup, FieldSet, Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FileUpload } from '@/components/ui/file-upload'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Undo, Redo } from 'lucide-react'

function TiptapEditor() {
  const editor = useEditor({
    extensions: [StarterKit],
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

export default function LayananForm() {
  return (
    <div>
      <form className="space-y-4">
        <FieldGroup>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel>Nama</FieldLabel>
                <Input type="text" placeholder="Masukkan Nama Layanan" />
              </Field>
              <Field>
                <FieldLabel>Detail Layanan</FieldLabel>
                <Input type="text" placeholder="Masukkan Detail Layanan" />
              </Field>
              <Field>
                <FieldLabel>Artikel</FieldLabel>
                <TiptapEditor />
              </Field>
              <FieldGroup className="grid md:grid-cols-2">
                <Field>
                  <FieldLabel>Gambar</FieldLabel>
                  <FileUpload label="Unggah Gambar" />
                </Field>
                <Field>
                  <FieldLabel>Icon</FieldLabel>
                  <FileUpload label="Unggah Icon" />
                </Field>
              </FieldGroup>
            </FieldGroup>
          </FieldSet>
          <Field orientation="horizontal">
            <Button type="submit">Tambahkan Layanan</Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}