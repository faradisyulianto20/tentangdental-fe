import { useEffect, useMemo } from 'react'
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

type RichTextEditorProps = {
  value: string
  onChange: (value: string) => void
}

export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  const tiptap = useEditor({
    extensions: [StarterKit],
    content: value,
    editorProps: {
      attributes: {
        class:
          'min-h-32 px-3 py-2 text-sm focus:outline-none [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:text-xl [&_h3]:font-bold',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
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
