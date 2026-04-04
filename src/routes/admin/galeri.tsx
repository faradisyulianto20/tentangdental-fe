import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { Trash } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Field, FieldLabel } from '#/components/ui/field'
import { FileUpload } from '#/components/ui/file-upload'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '#/components/ui/alert-dialog'
import {
  useAdminGalleries,
  useCreateAdminGallery,
  useDeleteAdminGallery,
} from '#/hooks/useGaleri'
import { appEnv } from '#/lib/env'
import { ApiError } from '#/lib/api-client'
import type { GalleryApiItem } from '#/services/galeriService'

export const Route = createFileRoute('/admin/galeri')({
  component: RouteComponent,
})

function mapImageUrl(url: string | null) {
  if (!url) return '/hero1.png'
  if (url.startsWith('http')) return url
  const cleanBase = appEnv.storageBaseUrl.replace(/\/+$/, '')
  const cleanPath = url.replace(/^\/+/, '')
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

function RouteComponent() {
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [selectedGaleri, setSelectedGaleri] = useState<GalleryApiItem | null>(
    null,
  )
  const [submitError, setSubmitError] = useState('')

  const galleriesQuery = useAdminGalleries()
  const createGallery = useCreateAdminGallery()
  const deleteGallery = useDeleteAdminGallery()

  const galleries = useMemo(
    () => galleriesQuery.data?.galleries || [],
    [galleriesQuery.data],
  )

  const handleCreate = async () => {
    setSubmitError('')

    if (!selectedImageFile) {
      setSubmitError('Pilih gambar terlebih dahulu.')
      return
    }

    try {
      await createGallery.mutateAsync({
        image: selectedImageFile,
      })
      setSelectedImageFile(null)
    } catch (error) {
      setSubmitError(readApiErrorMessage(error, 'Gagal menambahkan gambar.'))
    }
  }

  return (
    <div>
      <Field>
        <FieldLabel>Unggah Gambar Galeri</FieldLabel>
        <FileUpload
          acceptedFileTypes="image/png,image/jpeg,image/jpg,image/webp"
          onChange={(event) => {
            const file = event.target.files?.[0] || null
            setSelectedImageFile(file)
          }}
        />
      </Field>

      {submitError ? (
        <p className="text-sm text-destructive mt-3">{submitError}</p>
      ) : null}

      <Button
        className="mt-4"
        disabled={createGallery.isPending}
        onClick={handleCreate}
      >
        {createGallery.isPending ? 'Menambahkan...' : 'Tambahkan Gambar'}
      </Button>

      {galleriesQuery.isError ? (
        <p className="text-sm text-destructive mt-4">
          Gagal memuat daftar galeri.
        </p>
      ) : null}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {galleries.map((item) => (
          <div className="group relative" key={item.id}>
            <img
              src={mapImageUrl(item.image_url)}
              alt={`Galeri ${item.id}`}
              className="w-full h-48 object-cover rounded-md hover:brightness-90 transition-all"
            />
            <button
              type="button"
              onClick={() => setSelectedGaleri(item)}
              className="group-hover:opacity-100 opacity-0 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full p-1.5 text-red-600 bg-white/80 hover:bg-white transition-all cursor-pointer"
            >
              <Trash className="w-full h-full" />
            </button>
          </div>
        ))}
      </div>

      <AlertDialog
        open={!!selectedGaleri}
        onOpenChange={(open) => !open && setSelectedGaleri(null)}
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Gambar</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus gambar ini? Tindakan ini tidak
              dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={async () => {
                if (!selectedGaleri) return

                try {
                  await deleteGallery.mutateAsync(selectedGaleri.id)
                  setSelectedGaleri(null)
                } catch {
                  setSubmitError('Gagal menghapus gambar galeri.')
                }
              }}
            >
              {deleteGallery.isPending ? 'Menghapus...' : 'Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
