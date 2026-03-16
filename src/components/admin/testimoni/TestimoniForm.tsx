import { Button } from '#/components/ui/button'
import { Field, FieldLabel } from '#/components/ui/field'
import { FileUpload } from '#/components/ui/file-upload'
import { Input } from '#/components/ui/input'
import { Textarea } from '#/components/ui/textarea'
import { FileUp } from 'lucide-react'
import { Star } from 'lucide-react'
import { useState } from 'react'

export default function TestimoniForm() {
  const [rating, setRating] = useState(0)

  const handleRating = (value: number) => {
    setRating(value)
  }

  return (
    <div className='space-y-4'>
      <Field>
        <FieldLabel>Foto</FieldLabel>
        <FileUpload label="Unggah Foto" />
      </Field>
      <Field>
        <FieldLabel>Nama</FieldLabel>
        <Input type="text" placeholder="Masukkan Nama" />
      </Field>
      <Field className="gap-0">
        <FieldLabel>Rating</FieldLabel>
        <div className="flex gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <span
              key={i}
              className={`cursor-pointer ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
              onClick={() => handleRating(i + 1)}
            >
              <Star fill={i < rating ? 'currentColor' : 'none'} />
            </span>
          ))}
        </div>
      </Field>
      <Field>
        <FieldLabel>Deskripsi</FieldLabel>
        <Textarea placeholder="Masukkan Deskripsi" />
      </Field>
      <Field>
        <Button type="submit">Tambah Testimoni</Button>
      </Field>
    </div>
  )
}
