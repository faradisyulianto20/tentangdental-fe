import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
} from '@/components/ui/dialog'
import { FieldSet, FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FileUpload } from '#/components/ui/file-upload'
import RichTextEditor from '@/components/admin/RichTextEditor'
import {
  useAdminArticles,
  useCreateAdminArticle,
  useDeleteAdminArticle,
  useUpdateAdminArticle,
} from '@/hooks/useArtikel'
import type { AdminArticleItem } from '@/services/artikelService'
import { ApiError } from '@/lib/api-client'
import { appEnv } from '@/lib/env'

export const Route = createFileRoute('/admin/artikel')({
  component: RouteComponent,
})

type ArtikelFormValues = {
  title: string
  content: string
  imageFile: File | null
}

type ArtikelFormProps = {
  initialValues?: Partial<ArtikelFormValues>
  submitLabel: string
  isSubmitting?: boolean
  submitError?: string
  onSubmit: (values: ArtikelFormValues) => Promise<void> | void
  onCancel?: () => void
}

function decodeHtmlEntities(input: string) {
  return input
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
}

function resolveImage(value: string | null) {
  if (!value) return '/berita1.png'
  if (value.startsWith('http')) return value

  const cleanBase = appEnv.storageBaseUrl.replace(/\/+$/, '')
  const cleanPath = value.replace(/^\/+/, '')
  return cleanBase + '/' + cleanPath
}

function readApiErrorMessage(error: unknown, fallback: string) {
  if (!(error instanceof ApiError)) return fallback

  const payload =
    typeof error.payload === 'object' && error.payload !== null
      ? (error.payload as Record<string, unknown>)
      : null

  if (
    payload &&
    typeof payload.message === 'string' &&
    payload.message.length > 0
  ) {
    return payload.message
  }

  return error.message || fallback
}

function ArtikelForm({
  initialValues,
  submitLabel,
  isSubmitting,
  submitError,
  onSubmit,
  onCancel,
}: ArtikelFormProps) {
  const [values, setValues] = useState<ArtikelFormValues>({
    title: initialValues?.title || '',
    content: initialValues?.content || '<p></p>',
    imageFile: initialValues?.imageFile || null,
  })

  useEffect(() => {
    setValues({
      title: initialValues?.title || '',
      content: initialValues?.content || '<p></p>',
      imageFile: initialValues?.imageFile || null,
    })
  }, [initialValues])

  return (
    <form
      className="space-y-4"
      onSubmit={async (event) => {
        event.preventDefault()
        await onSubmit(values)
      }}
    >
      <FieldGroup>
        <FieldSet>
          <Field>
            <FieldLabel>Gambar Artikel</FieldLabel>
            <FileUpload
              label="Unggah Gambar Artikel"
              acceptedFileTypes="image/png,image/jpeg,image/jpg,image/webp"
              onChange={(event) => {
                const file = event.target.files?.[0] || null
                setValues((prev) => ({ ...prev, imageFile: file }))
              }}
            />
          </Field>
          <Field>
            <FieldLabel>Judul Artikel</FieldLabel>
            <Input
              type="text"
              placeholder="Masukkan Judul Artikel"
              value={values.title}
              onChange={(event) =>
                setValues((prev) => ({ ...prev, title: event.target.value }))
              }
            />
          </Field>
          <Field>
            <FieldLabel>Konten Artikel</FieldLabel>
            <RichTextEditor
              value={values.content}
              onChange={(next) =>
                setValues((prev) => ({ ...prev, content: next }))
              }
            />
          </Field>
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

function ArticleCard({
  item,
  onClick,
}: {
  item: AdminArticleItem
  onClick?: () => void
}) {
  return (
    <div
      className="flex flex-col shrink-0 w-64 rounded-md border cursor-pointer hover:shadow-md"
      onClick={onClick}
    >
      <img
        src={resolveImage(item.image_url)}
        alt={item.title}
        className="rounded-t-xl w-64 h-44 object-cover"
      />
      <div className="flex flex-col text-left p-4">
        <h2 className="text-lg font-semibold leading-5 line-clamp-2">
          {item.title}
        </h2>
        <p className="text-gray-600 mt-2 line-clamp-1 text-sm">{item.writer}</p>
      </div>
    </div>
  )
}

function RouteComponent() {
  const [selectedArtikel, setSelectedArtikel] =
    useState<AdminArticleItem | null>(null)
  const [createError, setCreateError] = useState('')
  const [updateError, setUpdateError] = useState('')
  const [createFormKey, setCreateFormKey] = useState(0)

  const articlesQuery = useAdminArticles()
  const createArticle = useCreateAdminArticle()
  const updateArticle = useUpdateAdminArticle()
  const deleteArticle = useDeleteAdminArticle()

  const articleList = useMemo(
    () => articlesQuery.data?.articles || [],
    [articlesQuery.data],
  )

  const handleCreate = async (values: ArtikelFormValues) => {
    setCreateError('')

    if (!values.imageFile) {
      setCreateError('Gambar artikel wajib diunggah.')
      return
    }

    await createArticle.mutateAsync({
      title: values.title,
      content: values.content,
      image: values.imageFile,
    })

    setCreateFormKey((prev) => prev + 1)
  }

  const handleUpdate = async (values: ArtikelFormValues) => {
    if (!selectedArtikel) return

    setUpdateError('')

    await updateArticle.mutateAsync({
      id: selectedArtikel.id,
      title: values.title,
      content: values.content,
      image: values.imageFile,
    })

    setSelectedArtikel(null)
  }

  const handleDelete = async () => {
    if (!selectedArtikel) return
    await deleteArticle.mutateAsync(selectedArtikel.id)
    setSelectedArtikel(null)
  }

  return (
    <div>
      <div className="mb-6">
        <ArtikelForm
          key={createFormKey}
          submitLabel="Tambahkan Artikel"
          isSubmitting={createArticle.isPending}
          submitError={createError}
          onSubmit={async (values) => {
            try {
              await handleCreate(values)
            } catch (error) {
              setCreateError(
                readApiErrorMessage(error, 'Gagal menambahkan artikel.'),
              )
            }
          }}
        />
      </div>

      {articlesQuery.isError ? (
        <p className="text-sm text-destructive mb-4">
          Gagal memuat daftar artikel.
        </p>
      ) : null}

      <div className="flex flex-wrap justify-center gap-6 mt-6">
        {articleList.map((item) => (
          <ArticleCard
            key={item.id}
            item={item}
            onClick={() => {
              setUpdateError('')
              setSelectedArtikel(item)
            }}
          />
        ))}
      </div>

      <Dialog
        open={!!selectedArtikel}
        onOpenChange={(open) => !open && setSelectedArtikel(null)}
      >
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedArtikel ? (
            <ArtikelForm
              submitLabel="Simpan Perubahan"
              isSubmitting={updateArticle.isPending}
              submitError={updateError}
              initialValues={{
                title: selectedArtikel.title,
                content: decodeHtmlEntities(selectedArtikel.content),
              }}
              onSubmit={async (values) => {
                try {
                  await handleUpdate(values)
                } catch (error) {
                  setUpdateError(
                    readApiErrorMessage(error, 'Gagal memperbarui artikel.'),
                  )
                }
              }}
            />
          ) : null}

          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline">Batal</Button>
            </DialogClose>
            <Button
              type="button"
              className="bg-red-400 hover:bg-red-500"
              disabled={deleteArticle.isPending}
              onClick={async () => {
                try {
                  await handleDelete()
                } catch {
                  setUpdateError('Gagal menghapus artikel.')
                }
              }}
            >
              {deleteArticle.isPending ? 'Menghapus...' : 'Hapus Artikel'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
