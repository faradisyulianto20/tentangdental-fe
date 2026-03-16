import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { FieldGroup, FieldSet, FieldLabel, Field } from '@/components/ui/field'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/login/')({
  component: RouteComponent,
})



function RouteComponent() {
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Logika autentikasi di sini (misalnya, validasi form, panggilan API, dll.)
    navigate({ to: '/admin' })
  }

  return (
    <div className="relative">
      <div className="absolute bg-primary h-screen w-lg right-0 -z-10" />
      <img
        src="/login.svg"
        alt="Login Image"
        className="absolute right-52 w-md h-122 rounded-xl object-cover top-1/2 -translate-y-1/2 -z-10"
      />
      <div className="grid grid-cols-2 items-center max-w-6xl mx-auto">
        <div className="mx-6 max-w-6xl w-3/4 my-32 space-y-4">
          <h1 className="font-bold text-4xl">Selamat Datang Admin</h1>
          <p className="text-muted-foreground">
            Silahkan melakukan login terlebih dahulu dengan memasukkan username
            dan password yang telah ada untuk bisa mengakses data.
          </p>
          <div>
            <form className="space-y-4" onSubmit={handleLogin}>
              <FieldGroup>
                <FieldSet>
                  <Field>
                    <FieldLabel>Nama Pengguna</FieldLabel>
                    <Input type="text" placeholder="Masukkan nama pengguna Anda" />
                  </Field>
                  <Field>
                    <FieldLabel>Kata Sandi</FieldLabel>
                    <Input type="password" placeholder="Masukkan Kata Sandi Anda" />
                  </Field>
                </FieldSet>
                <Field orientation="horizontal">
                  <Input type="checkbox" id="remember" className="w-4 h-4" />
                  <FieldLabel htmlFor="remember" className="text-sm text-muted-foreground">
                    Ingat Saya
                  </FieldLabel>
                </Field>
              </FieldGroup>
              <Field orientation="horizontal" className="w-full">
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </Field>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}