import { useEffect, useMemo, useState } from 'react'
import { Field, FieldGroup, FieldLabel, FieldSet } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'
import { FileUpload } from '#/components/ui/file-upload'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Undo,
  Redo,
} from 'lucide-react'

export type PromoFormValues = {
  name: string
  originalPrice: string
  promoPrice: string
  detail: string
  imageFile: File | null
}

type PromoFormProps = {
  initialValues?: Partial<PromoFormValues>
  submitLabel: string
  isSubmitting?: boolean
  submitError?: string
  onSubmit: (values: PromoFormValues) => Promise<void> | void
  onCancel?: () => void
}

function TiptapEditor({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const tiptap = useEditor({
    extensions: [StarterKit],
    content: value,
    editorProps: {
      attributes: {
        class:
          'min-h-32 px-3 py-2 text-sm focus:outline-none [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:text-xl [&_h3]:font-bold',
      },
    },
    onUpdate: ({ editor: nextEditor }) => {
      onChange(nextEditor.getHTML())
    },
  })

  useEffect(() => {
    const current = tiptap.getHTML()
    if (value !== current) {
      tiptap.commands.setContent(value || '<p></p>', { emitUpdate: false })
    }
  }, [tiptap, value])

  const tools = useMemo(
    () => [
      {
        icon: <Bold size={14} />,
        action: () => tiptap.chain().focus().toggleBold().run(),
        active: tiptap.isActive('bold'),
        title: 'Bold',
      },
      {
        icon: <Italic size={14} />,
        action: () => tiptap.chain().focus().toggleItalic().run(),
        active: tiptap.isActive('italic'),
        title: 'Italic',
      },
      {
        icon: <Heading2 size={14} />,
        action: () => tiptap.chain().focus().toggleHeading({ level: 2 }).run(),
        active: tiptap.isActive('heading', { level: 2 }),
        title: 'Heading 2',
      },
      {
        icon: <Heading3 size={14} />,
        action: () => tiptap.chain().focus().toggleHeading({ level: 3 }).run(),
        active: tiptap.isActive('heading', { level: 3 }),
        title: 'Heading 3',
      },
      {
        icon: <List size={14} />,
        action: () => tiptap.chain().focus().toggleBulletList().run(),
        active: tiptap.isActive('bulletList'),
        title: 'Bullet List',
      },
      {
        icon: <ListOrdered size={14} />,
        action: () => tiptap.chain().focus().toggleOrderedList().run(),
        active: tiptap.isActive('orderedList'),
        title: 'Ordered List',
      },
      {
        icon: <Undo size={14} />,
        action: () => tiptap.chain().focus().undo().run(),
        active: false,
        title: 'Undo',
      },
      {
        icon: <Redo size={14} />,
        action: () => tiptap.chain().focus().redo().run(),
        active: false,
        title: 'Redo',
      },
    ],
    [tiptap],
  )

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
      <EditorContent editor={tiptap} />
    </div>
  )
}

export default function PromoForm({
  initialValues,
  submitLabel,
  isSubmitting,
  submitError,
  onSubmit,
  onCancel,
}: PromoFormProps) {
  const [values, setValues] = useState<PromoFormValues>({
    name: initialValues?.name || '',
    originalPrice: initialValues?.originalPrice || '',
    promoPrice: initialValues?.promoPrice || '',
    detail: initialValues?.detail || '<p></p>',
    imageFile: initialValues?.imageFile || null,
  })

  useEffect(() => {
    setValues({
      name: initialValues?.name || '',
      originalPrice: initialValues?.originalPrice || '',
      promoPrice: initialValues?.promoPrice || '',
      detail: initialValues?.detail || '<p></p>',
      imageFile: initialValues?.imageFile || null,
    })
  }, [initialValues])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    await onSubmit(values)
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <FieldGroup>
        <FieldSet>
          <FieldGroup>
            <Field>
              <FileUpload
                label="Unggah Gambar Promo"
                acceptedFileTypes="image/png,image/jpeg,image/jpg,image/webp"
                onChange={(event) => {
                  const file = event.target.files?.[0] || null
                  setValues((prev) => ({ ...prev, imageFile: file }))
                }}
              />
            </Field>

            <Field>
              <FieldLabel>Judul Promo</FieldLabel>
              <Input
                type="text"
                placeholder="Masukkan Judul Promo"
                value={values.name}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, name: event.target.value }))
                }
              />
            </Field>

            <FieldGroup className="grid grid-cols-2">
              <Field>
                <FieldLabel>Harga Awal</FieldLabel>
                <Input
                  type="number"
                  placeholder="Masukkan Harga Awal"
                  value={values.originalPrice}
                  onChange={(event) =>
                    setValues((prev) => ({
                      ...prev,
                      originalPrice: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field>
                <FieldLabel>Harga Diskon</FieldLabel>
                <Input
                  type="number"
                  placeholder="Masukkan Harga Diskon"
                  value={values.promoPrice}
                  onChange={(event) =>
                    setValues((prev) => ({
                      ...prev,
                      promoPrice: event.target.value,
                    }))
                  }
                />
              </Field>
            </FieldGroup>

            <Field>
              <FieldLabel>Deskripsi Promo</FieldLabel>
              <TiptapEditor
                value={values.detail}
                onChange={(next) =>
                  setValues((prev) => ({ ...prev, detail: next }))
                }
              />
            </Field>
          </FieldGroup>
        </FieldSet>

        {submitError ? (
          <p className="text-sm text-destructive">{submitError}</p>
        ) : null}

        <Field orientation="horizontal" className="gap-2">
          {onCancel ? (
            <Button type="button" variant="outline" onClick={onCancel}>
              Batal
            </Button>
          ) : null}
          <Button type="submit" disabled={Boolean(isSubmitting)}>
            {isSubmitting ? 'Memproses...' : submitLabel}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
