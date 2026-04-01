import { useEffect, useState } from 'react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { FieldGroup, FieldSet, FieldLabel, Field } from '@/components/ui/field'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/hooks/useAuth'
import { ApiError } from '@/lib/api-client'
import { initializeAuth, loginWithPassword } from '@/lib/auth-session'

export const Route = createFileRoute('/login/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const auth = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    void initializeAuth()
  }, [])

  useEffect(() => {
    if (auth.status === 'authenticated') {
      void navigate({ to: '/admin' })
    }
  }, [auth.status, navigate])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Email dan password wajib diisi.')
      return
    }

    setLoading(true)

    try {
      await loginWithPassword({
        email: email.trim(),
        password,
      })
      await navigate({ to: '/admin' })
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          setErrorMessage('Email atau password salah.')
        } else if (error.status === 422) {
          setErrorMessage('Validasi gagal. Periksa input Anda.')
        } else {
          setErrorMessage(error.message || 'Gagal login.')
        }
      } else {
        setErrorMessage('Terjadi kesalahan jaringan.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative">
      <div className="absolute bg-primary h-screen w-lg right-0 -z-10" />
      <img
        src="/login.svg"
        alt="Login Image"
        className="hidden lg:block absolute right-52 w-md h-122 rounded-xl object-cover top-1/2 -translate-y-1/2 -z-10"
      />
      <div className="grid lg:grid-cols-2 items-center max-w-6xl mx-auto h-screen">
        <div className="p-6 sm:p-12 rounded-lg shadow-sm lg:shadow-none bg-white lg:bg-transparent mx-6 max-w-6xl lg:w-3/4 my-auto lg:my-32 space-y-4">
          <h1 className="font-bold text-2xl sm:text-4xl text-[#0A4864]">
            Selamat Datang Admin
          </h1>
          <p className="text-muted-foreground text-sm">
            Silahkan login menggunakan akun admin.
          </p>
          <div>
            <form className="space-y-4" onSubmit={handleLogin}>
              <FieldGroup>
                <FieldSet>
                  <Field>
                    <FieldLabel className="text-[#263A43] font-semibold">
                      Email
                    </FieldLabel>
                    <Input
                      type="email"
                      placeholder="Masukkan email admin"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      autoComplete="email"
                    />
                  </Field>
                  <Field>
                    <FieldLabel className="text-[#263A43] font-semibold">
                      Kata Sandi
                    </FieldLabel>
                    <Input
                      type="password"
                      placeholder="Masukkan kata sandi"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      autoComplete="current-password"
                    />
                  </Field>
                </FieldSet>
              </FieldGroup>
              {errorMessage && (
                <p className="text-sm text-red-600">{errorMessage}</p>
              )}
              <Field orientation="horizontal" className="w-full">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#A2C341] hover:bg-[#8AA83A] text-white"
                >
                  {loading ? 'Memproses...' : 'Login'}
                </Button>
              </Field>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
