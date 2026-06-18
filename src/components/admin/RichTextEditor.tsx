import { useEffect, useMemo, useState, useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import Highlight from '@tiptap/extension-highlight'
import Color from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import CharacterCount from '@tiptap/extension-character-count'

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Highlighter,
  Subscript as SubIcon,
  Superscript as SupIcon,
  Code2,
  Minus,
  Unlink,
  TableRowsSplit,
  TableColumnsSplit,
  Trash2,
} from 'lucide-react'

type RichTextEditorProps = {
  value: string
  onChange: (value: string) => void
  maxCharacters?: number
}

type ToolbarGroup = {
  label: string
  items: ToolItem[]
}

type ToolItem = {
  icon: React.ReactNode
  action: () => void
  active?: boolean
  title: string
  disabled?: boolean
}

// Modal kecil untuk input URL
function InputModal({
  title,
  placeholder,
  onConfirm,
  onCancel,
}: {
  title: string
  placeholder: string
  onConfirm: (value: string) => void
  onCancel: () => void
}) {
  const [val, setVal] = useState('')
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl p-5 w-80 space-y-3 border border-input">
        <p className="text-sm font-semibold">{title}</p>
        <input
          autoFocus
          type="text"
          placeholder={placeholder}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onConfirm(val)
            if (e.key === 'Escape') onCancel()
          }}
          className="w-full border border-input rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 text-sm rounded border border-input hover:bg-muted transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => onConfirm(val)}
            className="px-3 py-1.5 text-sm rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  )
}

const HIGHLIGHT_COLORS = [
  { color: '#fef08a', label: 'Kuning' },
  { color: '#bbf7d0', label: 'Hijau' },
  { color: '#bfdbfe', label: 'Biru' },
  { color: '#fecaca', label: 'Merah' },
  { color: '#e9d5ff', label: 'Ungu' },
]

const TEXT_COLORS = [
  { color: '#ef4444', label: 'Merah' },
  { color: '#3b82f6', label: 'Biru' },
  { color: '#22c55e', label: 'Hijau' },
  { color: '#f97316', label: 'Oranye' },
  { color: '#8b5cf6', label: 'Ungu' },
  { color: '#6b7280', label: 'Abu' },
  { color: '#000000', label: 'Hitam' },
]

export default function RichTextEditor({
  value,
  onChange,
  maxCharacters,
}: RichTextEditorProps) {
  const [modal, setModal] = useState<null | 'link' | 'image'>(null)
  const [showHighlightPicker, setShowHighlightPicker] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)

  const tiptap = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        link: false,
        underline: false,
      }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-primary underline cursor-pointer' },
      }),
      Image.configure({
        HTMLAttributes: { class: 'max-w-full rounded my-2' },
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Color,
      Subscript,
      Superscript,
      ...(maxCharacters ? [CharacterCount.configure({ limit: maxCharacters })] : [CharacterCount]),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: [
          'min-h-40 px-4 py-3 text-sm focus:outline-none',
          '[&_ul]:list-disc [&_ul]:ml-5',
          '[&_ol]:list-decimal [&_ol]:ml-5',
          '[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:my-2',
          '[&_h3]:text-xl [&_h3]:font-bold [&_h3]:my-1',
          '[&_a]:text-primary [&_a]:underline',
          '[&_blockquote]:border-l-4 [&_blockquote]:border-muted-foreground/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground',
          '[&_pre]:bg-muted [&_pre]:rounded [&_pre]:p-3 [&_pre]:text-xs [&_pre]:overflow-x-auto',
          '[&_code]:bg-muted [&_code]:px-1 [&_code]:rounded [&_code]:text-xs',
          '[&_hr]:border-muted [&_hr]:my-4',
          '[&_table]:w-full [&_table]:border-collapse [&_table]:my-2',
          '[&_th]:border [&_th]:border-input [&_th]:bg-muted [&_th]:px-2 [&_th]:py-1 [&_th]:text-xs [&_th]:font-semibold',
          '[&_td]:border [&_td]:border-input [&_td]:px-2 [&_td]:py-1 [&_td]:text-xs',
          '[&_mark]:rounded-sm [&_mark]:px-0.5',
          '[&_sub]:text-xs [&_sup]:text-xs',
        ].join(' '),
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
    if (!tiptap) return
    const current = tiptap.getHTML()
    if (value !== current) {
      tiptap.commands.setContent(value || '<p></p>', { emitUpdate: false })
    }
  }, [tiptap, value])

  const handleLinkConfirm = useCallback(
    (url: string) => {
      setModal(null)
      if (!url) return
      const href = url.startsWith('http') ? url : `https://${url}`
      tiptap?.chain().focus().setLink({ href }).run()
    },
    [tiptap],
  )

  const handleImageConfirm = useCallback(
    (url: string) => {
      setModal(null)
      if (!url) return
      tiptap?.chain().focus().setImage({ src: url }).run()
    },
    [tiptap],
  )

  const groups: ToolbarGroup[] = useMemo(() => {
    if (!tiptap) return []
    return [
      {
        label: 'History',
        items: [
          {
            icon: <Undo size={14} />,
            action: () => tiptap.chain().focus().undo().run(),
            active: false,
            disabled: !tiptap.can().undo(),
            title: 'Undo',
          },
          {
            icon: <Redo size={14} />,
            action: () => tiptap.chain().focus().redo().run(),
            active: false,
            disabled: !tiptap.can().redo(),
            title: 'Redo',
          },
        ],
      },
      {
        label: 'Format',
        items: [
          {
            icon: <Bold size={14} />,
            action: () => tiptap.chain().focus().toggleBold().run(),
            active: tiptap.isActive('bold'),
            title: 'Tebal (Ctrl+B)',
          },
          {
            icon: <Italic size={14} />,
            action: () => tiptap.chain().focus().toggleItalic().run(),
            active: tiptap.isActive('italic'),
            title: 'Miring (Ctrl+I)',
          },
          {
            icon: <UnderlineIcon size={14} />,
            action: () => tiptap.chain().focus().toggleUnderline().run(),
            active: tiptap.isActive('underline'),
            title: 'Garis Bawah (Ctrl+U)',
          },
          {
            icon: <SubIcon size={14} />,
            action: () => tiptap.chain().focus().toggleSubscript().run(),
            active: tiptap.isActive('subscript'),
            title: 'Subscript',
          },
          {
            icon: <SupIcon size={14} />,
            action: () => tiptap.chain().focus().toggleSuperscript().run(),
            active: tiptap.isActive('superscript'),
            title: 'Superscript',
          },
        ],
      },
      {
        label: 'Heading',
        items: [
          {
            icon: <Heading2 size={14} />,
            action: () =>
              tiptap.chain().focus().toggleHeading({ level: 2 }).run(),
            active: tiptap.isActive('heading', { level: 2 }),
            title: 'Heading 2',
          },
          {
            icon: <Heading3 size={14} />,
            action: () =>
              tiptap.chain().focus().toggleHeading({ level: 3 }).run(),
            active: tiptap.isActive('heading', { level: 3 }),
            title: 'Heading 3',
          },
        ],
      },
      {
        label: 'Align',
        items: [
          {
            icon: <AlignLeft size={14} />,
            action: () => tiptap.chain().focus().setTextAlign('left').run(),
            active: tiptap.isActive({ textAlign: 'left' }),
            title: 'Rata Kiri',
          },
          {
            icon: <AlignCenter size={14} />,
            action: () => tiptap.chain().focus().setTextAlign('center').run(),
            active: tiptap.isActive({ textAlign: 'center' }),
            title: 'Tengah',
          },
          {
            icon: <AlignRight size={14} />,
            action: () => tiptap.chain().focus().setTextAlign('right').run(),
            active: tiptap.isActive({ textAlign: 'right' }),
            title: 'Rata Kanan',
          },
          {
            icon: <AlignJustify size={14} />,
            action: () => tiptap.chain().focus().setTextAlign('justify').run(),
            active: tiptap.isActive({ textAlign: 'justify' }),
            title: 'Justify',
          },
        ],
      },
      {
        label: 'List',
        items: [
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
        ],
      },
      {
        label: 'Insert',
        items: [
          {
            icon: <LinkIcon size={14} />,
            action: () => setModal('link'),
            active: tiptap.isActive('link'),
            title: 'Sisipkan Link',
          },
          {
            icon: <Unlink size={14} />,
            action: () => tiptap.chain().focus().unsetLink().run(),
            active: false,
            disabled: !tiptap.isActive('link'),
            title: 'Hapus Link',
          },
          {
            icon: <ImageIcon size={14} />,
            action: () => setModal('image'),
            active: false,
            title: 'Sisipkan Gambar',
          },
          {
            icon: <TableIcon size={14} />,
            action: () =>
              tiptap
                .chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run(),
            active: false,
            title: 'Sisipkan Tabel',
          },
          {
            icon: <Code2 size={14} />,
            action: () => tiptap.chain().focus().toggleCodeBlock().run(),
            active: tiptap.isActive('codeBlock'),
            title: 'Blok Kode',
          },
          {
            icon: <Minus size={14} />,
            action: () => tiptap.chain().focus().setHorizontalRule().run(),
            active: false,
            title: 'Garis Horizontal',
          },
        ],
      },
      // Tabel kontrol (hanya tampil jika kursor di dalam tabel)
      ...(tiptap.isActive('table')
        ? [
            {
              label: 'Table',
              items: [
                {
                  icon: <TableRowsSplit size={14} />,
                  action: () => tiptap.chain().focus().addRowAfter().run(),
                  active: false,
                  title: 'Tambah Baris',
                },
                {
                  icon: <TableColumnsSplit size={14} />,
                  action: () => tiptap.chain().focus().addColumnAfter().run(),
                  active: false,
                  title: 'Tambah Kolom',
                },
                {
                  icon: <Trash2 size={14} />,
                  action: () => tiptap.chain().focus().deleteTable().run(),
                  active: false,
                  title: 'Hapus Tabel',
                },
              ],
            },
          ]
        : []),
    ]
  }, [tiptap, tiptap?.state])

  const charCount = tiptap?.storage.characterCount?.characters() ?? 0
  const wordCount = tiptap?.storage.characterCount?.words() ?? 0

  if (!tiptap) return null

  return (
    <div className="rounded-md border border-input overflow-hidden bg-background shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-input p-1.5 bg-muted/30">
        {groups.map((group, gi) => (
          <div key={group.label} className="flex items-center gap-0.5">
            {gi > 0 && (
              <div className="w-px h-5 bg-border mx-0.5 self-center shrink-0" />
            )}
            {group.items.map((tool) => (
              <button
                key={tool.title}
                type="button"
                title={tool.title}
                onClick={tool.action}
                disabled={tool.disabled}
                className={[
                  'p-1.5 rounded transition-colors',
                  tool.disabled
                    ? 'opacity-30 cursor-not-allowed'
                    : 'hover:bg-muted',
                  tool.active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground',
                ].join(' ')}
              >
                {tool.icon}
              </button>
            ))}
          </div>
        ))}

        {/* Divider */}
        <div className="w-px h-5 bg-border mx-0.5 self-center shrink-0" />

        {/* Highlight color picker */}
        <div className="relative">
          <button
            type="button"
            title="Highlight"
            onClick={() => {
              setShowHighlightPicker((p) => !p)
              setShowColorPicker(false)
            }}
            className={[
              'p-1.5 rounded transition-colors hover:bg-muted',
              tiptap.isActive('highlight')
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground',
            ].join(' ')}
          >
            <Highlighter size={14} />
          </button>
          {showHighlightPicker && (
            <div className="absolute top-full left-0 mt-1 z-20 bg-white dark:bg-zinc-900 border border-input rounded-md shadow-lg p-2 flex gap-1">
              {HIGHLIGHT_COLORS.map((c) => (
                <button
                  key={c.color}
                  type="button"
                  title={c.label}
                  onClick={() => {
                    tiptap
                      .chain()
                      .focus()
                      .setHighlight({ color: c.color })
                      .run()
                    setShowHighlightPicker(false)
                  }}
                  className="w-5 h-5 rounded border border-input hover:scale-110 transition-transform"
                  style={{ backgroundColor: c.color }}
                />
              ))}
              <button
                type="button"
                title="Hapus highlight"
                onClick={() => {
                  tiptap.chain().focus().unsetHighlight().run()
                  setShowHighlightPicker(false)
                }}
                className="w-5 h-5 rounded border border-input text-[10px] text-muted-foreground hover:bg-muted flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Text color picker */}
        <div className="relative">
          <button
            type="button"
            title="Warna Teks"
            onClick={() => {
              setShowColorPicker((p) => !p)
              setShowHighlightPicker(false)
            }}
            className="p-1.5 rounded transition-colors hover:bg-muted text-muted-foreground"
          >
            <span className="text-xs font-bold leading-none" style={{ fontFamily: 'serif' }}>
              A
            </span>
          </button>
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 z-20 bg-white dark:bg-zinc-900 border border-input rounded-md shadow-lg p-2 flex gap-1">
              {TEXT_COLORS.map((c) => (
                <button
                  key={c.color}
                  type="button"
                  title={c.label}
                  onClick={() => {
                    tiptap.chain().focus().setColor(c.color).run()
                    setShowColorPicker(false)
                  }}
                  className="w-5 h-5 rounded border border-input hover:scale-110 transition-transform"
                  style={{ backgroundColor: c.color }}
                />
              ))}
              <button
                type="button"
                title="Reset warna"
                onClick={() => {
                  tiptap.chain().focus().unsetColor().run()
                  setShowColorPicker(false)
                }}
                className="w-5 h-5 rounded border border-input text-[10px] text-muted-foreground hover:bg-muted flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bubble menu untuk link */}
      <BubbleMenu
        editor={tiptap}
        shouldShow={({ editor }) => editor.isActive('link')}
      >
        <div className="flex gap-1 bg-white dark:bg-zinc-900 border border-input rounded shadow-lg px-2 py-1">
          <button
            type="button"
            onClick={() => setModal('link')}
            className="text-xs text-primary hover:underline"
          >
            Edit
          </button>
          <span className="text-muted-foreground text-xs">|</span>
          <button
            type="button"
            onClick={() => tiptap.chain().focus().unsetLink().run()}
            className="text-xs text-destructive hover:underline"
          >
            Hapus
          </button>
        </div>
      </BubbleMenu>

      {/* Editor area */}
      <EditorContent editor={tiptap} />

      {/* Footer: word/char count */}
      <div className="flex justify-end gap-3 px-3 py-1.5 bg-muted/20 border-t border-input text-[11px] text-muted-foreground">
        <span>{wordCount} kata</span>
        <span>
          {charCount}
          {maxCharacters ? ` / ${maxCharacters}` : ''} karakter
        </span>
      </div>

      {/* Modal input */}
      {modal === 'link' && (
        <InputModal
          title="Masukkan URL Link"
          placeholder="https://example.com"
          onConfirm={handleLinkConfirm}
          onCancel={() => setModal(null)}
        />
      )}
      {modal === 'image' && (
        <InputModal
          title="Masukkan URL Gambar"
          placeholder="https://example.com/image.jpg"
          onConfirm={handleImageConfirm}
          onCancel={() => setModal(null)}
        />
      )}
    </div>
  )
}