import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { LayananCard } from '@/components/beranda/Layanan'
import LayananForm from '@/components/admin/layanan/LayananForm'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
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
  useAdminServices,
  useCreateAdminService,
  useDeleteAdminService,
  useUpdateAdminService,
} from '@/hooks/useLayanan'
import type { AdminServiceItem } from '@/services/layananService'
import { ApiError } from '@/lib/api-client'

export const Route = createFileRoute('/admin/layanan')({
  component: RouteComponent,
})

function toLayananCard(item: AdminServiceItem) {
  return {
    id: item.id,
    name: item.name,
    detail: item.detail,
    icon_url: item.icon_url,
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
  const [selectedService, setSelectedService] =
    useState<AdminServiceItem | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminServiceItem | null>(
    null,
  )
  const [createError, setCreateError] = useState('')
  const [updateError, setUpdateError] = useState('')
  const [createFormKey, setCreateFormKey] = useState(0)

  const servicesQuery = useAdminServices()
  const createService = useCreateAdminService()
  const updateService = useUpdateAdminService()
  const deleteService = useDeleteAdminService()

  const serviceList = useMemo(
    () => servicesQuery.data?.services || [],
    [servicesQuery.data],
  )

  const handleCreate = async (values: {
    name: string
    detail: string
    articleContent: string
    iconFile: File | null
    supportImageFile: File | null
  }) => {
    setCreateError('')

    if (!values.iconFile) {
      setCreateError('Icon layanan wajib diunggah.')
      return
    }

    if (!values.supportImageFile) {
      setCreateError('Gambar pendukung wajib diunggah.')
      return
    }

    await createService.mutateAsync({
      name: values.name,
      detail: values.detail,
      article_content: values.articleContent,
      icon: values.iconFile,
      support_image: values.supportImageFile,
    })

    setCreateFormKey((prev) => prev + 1)
  }

  const handleUpdate = async (values: {
    name: string
    detail: string
    articleContent: string
    iconFile: File | null
    supportImageFile: File | null
  }) => {
    if (!selectedService) return

    setUpdateError('')

    await updateService.mutateAsync({
      id: selectedService.id,
      name: values.name,
      detail: values.detail,
      article_content: values.articleContent,
      icon: values.iconFile,
      support_image: values.supportImageFile,
    })

    setSelectedService(null)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteService.mutateAsync(deleteTarget.id)
    setDeleteTarget(null)
    setSelectedService(null)
  }

  return (
    <div>
      <div className="mb-6">
        <LayananForm
          key={createFormKey}
          submitLabel="Tambahkan Layanan"
          isSubmitting={createService.isPending}
          submitError={createError}
          onSubmit={async (values) => {
            try {
              await handleCreate(values)
            } catch (error) {
              setCreateError(
                readApiErrorMessage(error, 'Gagal menambahkan layanan.'),
              )
            }
          }}
        />
      </div>

      {servicesQuery.isError ? (
        <p className="text-sm text-destructive mb-4">
          Gagal memuat daftar layanan.
        </p>
      ) : null}

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6"
        data-testid="layanan-grid"
      >
        {serviceList.map((service) => (
          <div
            key={service.id}
            onClick={() => {
              setUpdateError('')
              setSelectedService(service)
            }}
            className="cursor-pointer"
            data-testid={`layanan-card-${service.id}`}
          >
            <LayananCard layanan={toLayananCard(service)} />
          </div>
        ))}
      </div>

      <Dialog
        open={!!selectedService}
        onOpenChange={(open) => !open && setSelectedService(null)}
      >
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedService ? (
            <LayananForm
              submitLabel="Simpan Perubahan"
              isSubmitting={updateService.isPending}
              submitError={updateError}
              existingIconUrl={selectedService.icon_url}
              existingSupportImageUrl={selectedService.support_image_url}
              initialValues={{
                name: selectedService.name,
                detail: selectedService.detail,
                articleContent: selectedService.article_content,
              }}
              onSubmit={async (values) => {
                try {
                  await handleUpdate(values)
                } catch (error) {
                  setUpdateError(
                    readApiErrorMessage(error, 'Gagal memperbarui layanan.'),
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
              disabled={deleteService.isPending}
              onClick={() => setDeleteTarget(selectedService)}
              data-testid="layanan-hapus-button"
            >
              {deleteService.isPending ? 'Menghapus...' : 'Hapus Layanan'}
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
            <AlertDialogTitle>Hapus Layanan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus layanan ini? Tindakan ini tidak
              dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              disabled={deleteService.isPending}
              onClick={async (e) => {
                e.preventDefault()
                try {
                  await handleDelete()
                } catch {
                  setUpdateError('Gagal menghapus layanan.')
                  setDeleteTarget(null)
                }
              }}
            >
              {deleteService.isPending ? 'Menghapus...' : 'Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
