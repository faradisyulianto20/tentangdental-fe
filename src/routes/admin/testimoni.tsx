import TestimoniForm from '@/components/admin/testimoni/TestimoniForm'
import { createFileRoute } from '@tanstack/react-router'
import { Star } from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '#/components/ui/button'
import {
  useAdminTestimonials,
  useCreateAdminTestimonial,
  useDeleteAdminTestimonial,
  useUpdateAdminTestimonial,
} from '@/hooks/useTestimonials'
import type { TestimonialApiItem } from '@/services/testimonialService'
import { ApiError } from '@/lib/api-client'
import { appEnv } from '@/lib/env'

export const Route = createFileRoute('/admin/testimoni')({
  component: RouteComponent,
})

function mapPhoto(url: string | null) {
  if (!url) return '/muka.svg'
  if (url.startsWith('http')) return url
  const cleanBase = appEnv.storageBaseUrl.replace(/\/+$/, '')
  const cleanPath = url.replace(/^\/+/, '')
  return cleanBase + '/' + cleanPath
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
  const [selectedTestimoni, setSelectedTestimoni] =
    useState<TestimonialApiItem | null>(null)
  const [createError, setCreateError] = useState('')
  const [updateError, setUpdateError] = useState('')
  const [createFormKey, setCreateFormKey] = useState(0)

  const testimonialsQuery = useAdminTestimonials()
  const createTestimonial = useCreateAdminTestimonial()
  const updateTestimonial = useUpdateAdminTestimonial()
  const deleteTestimonial = useDeleteAdminTestimonial()

  const testimonialList = useMemo(
    () => testimonialsQuery.data?.testimonials || [],
    [testimonialsQuery.data],
  )

  const handleCreate = async (values: {
    name: string
    rating: number
    testimoni: string
    photoFile: File | null
  }) => {
    setCreateError('')

    await createTestimonial.mutateAsync({
      name: values.name,
      rating: values.rating,
      testimoni: values.testimoni,
      photo: values.photoFile,
    })

    setCreateFormKey((prev) => prev + 1)
  }

  const handleUpdate = async (values: {
    name: string
    rating: number
    testimoni: string
    photoFile: File | null
  }) => {
    if (!selectedTestimoni) return

    setUpdateError('')

    await updateTestimonial.mutateAsync({
      id: selectedTestimoni.id,
      name: values.name,
      rating: values.rating,
      testimoni: values.testimoni,
      photo: values.photoFile,
    })

    setSelectedTestimoni(null)
  }

  const handleDelete = async () => {
    if (!selectedTestimoni) return
    await deleteTestimonial.mutateAsync(selectedTestimoni.id)
    setSelectedTestimoni(null)
  }

  return (
    <div>
      <div className="mb-6">
        <TestimoniForm
          key={createFormKey}
          submitLabel="Tambah Testimoni"
          isSubmitting={createTestimonial.isPending}
          submitError={createError}
          onSubmit={async (values) => {
            try {
              await handleCreate(values)
            } catch (error) {
              setCreateError(
                readApiErrorMessage(error, 'Gagal menambahkan testimoni.'),
              )
            }
          }}
        />
      </div>

      {testimonialsQuery.isError ? (
        <p className="text-sm text-destructive mb-4">
          Gagal memuat daftar testimoni.
        </p>
      ) : null}

      <div className="flex flex-col gap-4 mt-6">
        {testimonialList.map((testimoni) => (
          <TestimoniCard
            key={testimoni.id}
            testimoni={testimoni}
            onClick={() => {
              setUpdateError('')
              setSelectedTestimoni(testimoni)
            }}
          />
        ))}
      </div>

      <Dialog
        open={!!selectedTestimoni}
        onOpenChange={(open) => !open && setSelectedTestimoni(null)}
      >
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedTestimoni ? (
            <TestimoniForm
              submitLabel="Simpan Perubahan"
              isSubmitting={updateTestimonial.isPending}
              submitError={updateError}
              initialValues={{
                name: selectedTestimoni.name,
                rating: selectedTestimoni.rating,
                testimoni: selectedTestimoni.testimoni,
              }}
              onSubmit={async (values) => {
                try {
                  await handleUpdate(values)
                } catch (error) {
                  setUpdateError(
                    readApiErrorMessage(error, 'Gagal memperbarui testimoni.'),
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
              disabled={deleteTestimonial.isPending}
              onClick={async () => {
                try {
                  await handleDelete()
                } catch {
                  setUpdateError('Gagal menghapus testimoni.')
                }
              }}
            >
              {deleteTestimonial.isPending ? 'Menghapus...' : 'Hapus Testimoni'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function TestimoniCard({
  testimoni,
  onClick,
}: {
  testimoni: TestimonialApiItem
  onClick?: () => void
}) {
  return (
    <div
      onClick={onClick}
      className="flex border rounded-lg p-4 gap-2 cursor-pointer"
    >
      <img
        src={mapPhoto(testimoni.photo_url)}
        alt={testimoni.name}
        className="w-16 h-16 rounded-full object-cover shrink-0"
      />
      <div className="flex flex-col gap-1">
        <p className="text-sm font-bold">{testimoni.name}</p>
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className="w-4 h-4"
              color="oklch(0.905 0.182 98.244)"
              fill={i < testimoni.rating ? 'oklch(0.905 0.182 98.244)' : 'none'}
            />
          ))}
        </div>
        <div
          className="text-sm text-muted-foreground line-clamp-2 [&_strong]:font-bold [&_em]:italic"
          dangerouslySetInnerHTML={{
            __html: decodeHtmlEntities(testimoni.testimoni || ''),
          }}
        />
      </div>
    </div>
  )
}
