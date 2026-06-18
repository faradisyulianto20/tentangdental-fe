import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { PromoCard } from '@/components/beranda/Promo'
import PromoForm from '@/components/admin/promo/PromoForm'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  useAdminPromos,
  useCreateAdminPromo,
  useDeleteAdminPromo,
  useUpdateAdminPromo,
} from '@/hooks/usePromo'
import type { AdminPromoItem } from '@/services/promoService'
import { ApiError } from '@/lib/api-client'
import { appEnv } from '@/lib/env'

export const Route = createFileRoute('/admin/promo')({
  component: RouteComponent,
})

function mapImageUrl(url: string | null) {
  if (!url) return '/hero.png'
  if (url.startsWith('http')) return url
  const cleanBase = appEnv.storageBaseUrl.replace(/\/+$/, '')
  const cleanPath = url.replace(/^\/+/, '')
  return cleanBase + '/' + cleanPath
}

function toPromoCard(item: AdminPromoItem) {
  return {
    judul: item.name,
    imgUrl: mapImageUrl(item.image_url),
    hargaAwal: Number(item.original_price || 0),
    hargaDiskon: Number(item.promo_price || 0),
    detail: String(item.detail || ''),
  }
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
  const [selectedPromo, setSelectedPromo] = useState<AdminPromoItem | null>(
    null,
  )
  const [deleteTarget, setDeleteTarget] = useState<AdminPromoItem | null>(null)
  const [createError, setCreateError] = useState('')
  const [updateError, setUpdateError] = useState('')
  const [createFormKey, setCreateFormKey] = useState(0)

  const adminPromos = useAdminPromos()
  const createPromo = useCreateAdminPromo()
  const updatePromo = useUpdateAdminPromo()
  const deletePromo = useDeleteAdminPromo()

  const promoList = useMemo(
    () => adminPromos.data?.promos || [],
    [adminPromos.data],
  )

  const handleCreate = async (values: {
    name: string
    originalPrice: string
    promoPrice: string
    detail: string
    imageFile: File | null
  }) => {
    setCreateError('')

    if (!values.imageFile) {
      setCreateError('Gambar promo wajib diunggah.')
      return
    }

    await createPromo.mutateAsync({
      name: values.name,
      detail: values.detail,
      original_price: Number(values.originalPrice || 0),
      promo_price: Number(values.promoPrice || 0),
      image: values.imageFile,
    })

    setCreateFormKey((prev) => prev + 1)
  }

  const handleUpdate = async (values: {
    name: string
    originalPrice: string
    promoPrice: string
    detail: string
    imageFile: File | null
  }) => {
    if (!selectedPromo) return

    setUpdateError('')

    await updatePromo.mutateAsync({
      id: selectedPromo.id,
      name: values.name,
      detail: values.detail,
      original_price: Number(values.originalPrice || 0),
      promo_price: Number(values.promoPrice || 0),
      image: values.imageFile,
    })

    setSelectedPromo(null)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deletePromo.mutateAsync(deleteTarget.id)
    setDeleteTarget(null)
    setSelectedPromo(null)
  }

  return (
    <div>
      <div className="mb-6">
        <PromoForm
          key={createFormKey}
          submitLabel="Tambahkan Promo"
          isSubmitting={createPromo.isPending}
          submitError={createError}
          onSubmit={async (values) => {
            try {
              await handleCreate(values)
            } catch (error) {
              setCreateError(
                readApiErrorMessage(error, 'Gagal menambahkan promo.'),
              )
            }
          }}
        />
      </div>

      {adminPromos.isError ? (
        <p className="text-sm text-destructive mb-4">
          Gagal memuat daftar promo.
        </p>
      ) : null}

      <div className="flex flex-wrap gap-6 justify-center">
        {promoList.map((promo) => (
          <div
            key={promo.id}
            onClick={() => {
              setUpdateError('')
              setSelectedPromo(promo)
            }}
            className="cursor-pointer"
            data-testid={`promo-card-${promo.id}`}
          >
            <PromoCard promo={toPromoCard(promo)} variants={null} />
          </div>
        ))}
      </div>

      <Dialog
        open={!!selectedPromo}
        onOpenChange={(open) => !open && setSelectedPromo(null)}
      >
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto no-scrollbar">
          {selectedPromo ? (
            <PromoForm
              submitLabel="Simpan Perubahan"
              isSubmitting={updatePromo.isPending}
              submitError={updateError}
              existingImageUrl={selectedPromo.image_url}
              initialValues={{
                name: selectedPromo.name,
                originalPrice: String(selectedPromo.original_price),
                promoPrice: String(selectedPromo.promo_price),
                detail: selectedPromo.detail,
              }}
              onSubmit={async (values) => {
                try {
                  await handleUpdate(values)
                } catch (error) {
                  setUpdateError(
                    readApiErrorMessage(error, 'Gagal memperbarui promo.'),
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
              disabled={deletePromo.isPending}
              onClick={() => setDeleteTarget(selectedPromo)}
              data-testid="promo-hapus-button"
            >
              {deletePromo.isPending ? 'Menghapus...' : 'Hapus Promo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Promo</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus promo ini? Tindakan ini tidak
              dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              disabled={deletePromo.isPending}
              onClick={async (e) => {
                e.preventDefault()
                try {
                  await handleDelete()
                } catch {
                  setUpdateError('Gagal menghapus promo.')
                  setDeleteTarget(null)
                }
              }}
            >
              {deletePromo.isPending ? 'Menghapus...' : 'Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
