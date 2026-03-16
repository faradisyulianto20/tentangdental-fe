import { FieldSet, Field, FieldLabel} from "@/components/ui/field";
import { FileUpload } from "#/components/ui/file-upload";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";
import { Button } from "#/components/ui/button";

export default function ArtikelForm() {
  return (
    <FieldSet className="">
        <Field className="grid w-full items-center gap-4">
            <FieldLabel>Judul Artikel</FieldLabel>
            <FileUpload />
        </Field>
      <Field className="grid w-full items-center gap-4">
        <FieldLabel>Judul Artikel</FieldLabel>
        <Input id="judul" placeholder="Masukkan judul artikel" />
      </Field>
        <Field className="grid w-full items-center gap-4">
            <FieldLabel htmlFor="penulis">Penulis</FieldLabel>
            <Input id="penulis" placeholder="Masukkan nama penulis" />
        </Field>
        <Field className="grid w-full items-center gap-4">
            <FieldLabel htmlFor="konten">Konten Artikel</FieldLabel>
            <Textarea id="konten" placeholder="Masukkan konten artikel" className="h-32 resize-none" />
        </Field>
        <Field orientation="horizontal">
            <Button type="submit">Tambahkan Artikel</Button>
        </Field>
    </FieldSet>
  )
}