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
  const [selectedService, setSelectedService] =
    useState<AdminServiceItem | null>(null)
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
    if (!selectedService) return
    await deleteService.mutateAsync(selectedService.id)
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {serviceList.map((service) => (
          <div
            key={service.id}
            onClick={() => {
              setUpdateError('')
              setSelectedService(service)
            }}
            className="cursor-pointer"
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
              onClick={async () => {
                try {
                  await handleDelete()
                } catch {
                  setUpdateError('Gagal menghapus layanan.')
                }
              }}
            >
              {deleteService.isPending ? 'Menghapus...' : 'Hapus Layanan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
