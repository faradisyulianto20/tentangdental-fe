import { Button } from '#/components/ui/button'
import { Field, FieldLabel } from '#/components/ui/field'
import { FileUpload } from '#/components/ui/file-upload'
import { createFileRoute } from '@tanstack/react-router'
import { Trash } from 'lucide-react'
import { useState } from 'react'
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

export const Route = createFileRoute('/admin/galeri')({
  component: RouteComponent,
})

function RouteComponent() {
  const [selectedGaleri, setSelectedGaleri] = useState<typeof galeriList[0] | null>(null)

  return (
    <div>
      <Field>
        <FieldLabel>Unggah Gambar Galeri</FieldLabel>
        <FileUpload />
      </Field>
      <Button className="mt-4">Tambahkan Gambar</Button>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {galeriList.map((item, index) => (
          <div className="group relative" key={index}>
            <img
              src={item.imgPath}
              alt={item.title}
              className="w-full h-48 object-cover rounded-md hover:brightness-90 transition-all"
            />
            <Trash
              onClick={() => setSelectedGaleri(item)}
              className="group-hover:opacity-100 opacity-0 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full p-1.5 text-red-600 bg-white/80 hover:bg-white transition-all cursor-pointer"
            />
          </div>
        ))}
      </div>

      <AlertDialog open={!!selectedGaleri} onOpenChange={(open) => !open && setSelectedGaleri(null)}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Gambar</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus gambar{' '}
              <span className="font-bold">'{selectedGaleri?.title}'</span>?
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => setSelectedGaleri(null)}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

const galeriList = [
  { imgPath: '/hero1.png', title: 'Galeri 1' },
  { imgPath: '/hero2.png', title: 'Galeri 2' },
  { imgPath: '/hero3.png', title: 'Galeri 3' },
  { imgPath: '/hero4.png', title: 'Galeri 4' },
]