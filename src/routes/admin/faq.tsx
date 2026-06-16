import { FAQItem } from '@/components/beranda/FAQ'
import { Button } from '#/components/ui/button'
import { Field, FieldLabel } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { Trash, Pencil } from 'lucide-react'
import RichTextEditor from '@/components/admin/RichTextEditor'
import {
  useAdminFaqs,
  useCreateAdminFaq,
  useDeleteAdminFaq,
  useUpdateAdminFaq,
} from '@/hooks/useFaq'
import type { FaqApiItem } from '@/services/faqService'
import { ApiError } from '@/lib/api-client'

export const Route = createFileRoute('/admin/faq')({
  component: RouteComponent,
})

type FAQForm = {
  question: string
  answer: string
}

function decodeHtmlEntities(input: string) {
  return input
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
}

function readApiErrorMessage(error: unknown, fallback: string) {
  if (!(error instanceof ApiError)) {
    return error instanceof Error && error.message ? error.message : fallback
  }

  const payload =
    typeof error.payload === 'object' && error.payload !== null
      ? (error.payload as Record<string, unknown>)
      : null

  const fieldErrors = payload?.errors
  if (fieldErrors && typeof fieldErrors === 'object') {
    const queue: unknown[] = [fieldErrors]

    while (queue.length > 0) {
      const current = queue.shift()

      if (typeof current === 'string' && current.trim().length > 0) {
        return current
      }

      if (Array.isArray(current)) {
        queue.push(...current)
        continue
      }

      if (current && typeof current === 'object') {
        queue.push(...Object.values(current as Record<string, unknown>))
      }
    }
  }

  if (
    payload &&
    typeof payload.message === 'string' &&
    payload.message.length > 0
  ) {
    return payload.message
  }

  return error.message || fallback
}

function RouteComponent() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [editId, setEditId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<FAQForm>({
    question: '',
    answer: '<p></p>',
  })
  const [newForm, setNewForm] = useState<FAQForm>({
    question: '',
    answer: '<p></p>',
  })
  const [createError, setCreateError] = useState('')
  const [editError, setEditError] = useState('')

  const faqsQuery = useAdminFaqs()
  const createFaq = useCreateAdminFaq()
  const updateFaq = useUpdateAdminFaq()
  const deleteFaq = useDeleteAdminFaq()

  const list = useMemo(() => faqsQuery.data?.faqs || [], [faqsQuery.data])

  const handleEditStart = (item: FaqApiItem) => {
    setEditId(item.id)
    setEditError('')
    setEditForm({
      question: item.question,
      answer: decodeHtmlEntities(item.answer || '<p></p>'),
    })
  }

  const handleEditSave = async (id: number) => {
    await updateFaq.mutateAsync({
      id,
      question: editForm.question,
      answer: editForm.answer,
    })
    setEditId(null)
  }

  const handleDelete = async (id: number, index: number) => {
    await deleteFaq.mutateAsync(id)
    if (openIndex === index) setOpenIndex(null)
    if (editId === id) setEditId(null)
  }

  const handleAdd = async () => {
    setCreateError('')

    if (!newForm.question.trim()) {
      setCreateError('Pertanyaan wajib diisi.')
      return
    }

    try {
      await createFaq.mutateAsync({
        question: newForm.question,
        answer: newForm.answer,
      })
      setNewForm({ question: '', answer: '<p></p>' })
    } catch (error) {
      setCreateError(readApiErrorMessage(error, 'Gagal menambah FAQ.'))
    }
  }

  return (
    <div>
      <div className="space-y-4">
        <Field>
          <FieldLabel>
            Pertanyaan <span className="text-red-500">*</span>
          </FieldLabel>
          <Input
            placeholder="Masukkan pertanyaan"
            value={newForm.question}
            onChange={(e) =>
              setNewForm({ ...newForm, question: e.target.value })
            }
          />
        </Field>
        <Field>
          <FieldLabel>
            Jawaban <span className="text-red-500">*</span>
          </FieldLabel>
          <RichTextEditor
            value={newForm.answer}
            onChange={(next) => setNewForm({ ...newForm, answer: next })}
          />
        </Field>
        {createError ? (
          <p className="text-sm text-destructive">{createError}</p>
        ) : null}
        <Button disabled={createFaq.isPending} onClick={handleAdd}>
          {createFaq.isPending ? 'Memproses...' : 'Tambah FAQ'}
        </Button>
      </div>

      {faqsQuery.isError ? (
        <p className="text-sm text-destructive mt-4">
          Gagal memuat daftar FAQ.
        </p>
      ) : null}

      <div className="mt-6 space-y-4">
        {list.map((faq, index) => (
          <div key={faq.id} className="border rounded-lg overflow-hidden">
            {editId === faq.id ? (
              <div className="p-4 space-y-3">
                <Field>
                  <FieldLabel>Pertanyaan</FieldLabel>
                  <Input
                    value={editForm.question}
                    onChange={(e) =>
                      setEditForm({ ...editForm, question: e.target.value })
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel>Jawaban</FieldLabel>
                  <RichTextEditor
                    value={editForm.answer}
                    onChange={(next) =>
                      setEditForm({ ...editForm, answer: next })
                    }
                  />
                </Field>
                {editError ? (
                  <p className="text-sm text-destructive">{editError}</p>
                ) : null}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    disabled={updateFaq.isPending}
                    onClick={async () => {
                      try {
                        await handleEditSave(faq.id)
                      } catch (error) {
                        setEditError(
                          readApiErrorMessage(error, 'Gagal memperbarui FAQ.'),
                        )
                      }
                    }}
                  >
                    {updateFaq.isPending ? 'Memproses...' : 'Simpan'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditId(null)}
                  >
                    Batal
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <FAQItem
                    item={faq}
                    index={index}
                    isOpen={openIndex === index}
                    onClick={() =>
                      setOpenIndex(openIndex === index ? null : index)
                    }
                  />
                </div>
                <div className="flex gap-1 p-3 shrink-0">
                  <button
                    onClick={() => handleEditStart(faq)}
                    className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        await handleDelete(faq.id, index)
                      } catch (error) {
                        setEditError(
                          readApiErrorMessage(error, 'Gagal menghapus FAQ.'),
                        )
                      }
                    }}
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
