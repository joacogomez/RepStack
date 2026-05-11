import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, register } from '../api/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dumbbell, Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const [modo, setModo] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (modo === 'register') {
        await register({ nombre, email, password })
      }
      const params = new URLSearchParams()
      params.append('username', email)
      params.append('password', password)
      const res = await login(params)
      localStorage.setItem('token', res.data.access_token)
      navigate('/home')
    } catch {
      setError('Email o contraseña incorrectos')
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Círculos decorativos */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-60"
          style={{ background: "radial-gradient(circle, oklch(0.92 0.04 75) 0%, oklch(0.96 0.02 75 / 0) 70%)" }} />
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full opacity-50"
          style={{ background: "radial-gradient(circle, oklch(0.65 0.08 55) 0%, oklch(0.75 0.06 55 / 0) 70%)" }} />
        <div className="absolute left-1/4 top-1/3 h-48 w-48 rounded-full opacity-40"
          style={{ background: "radial-gradient(circle, oklch(0.88 0.05 75) 0%, oklch(0.92 0.03 75 / 0) 70%)" }} />
        <div className="absolute -bottom-40 -right-10 h-[500px] w-[500px] rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, oklch(0.55 0.07 55) 0%, oklch(0.65 0.05 55 / 0) 70%)" }} />
        <div className="absolute left-10 top-20 h-32 w-32 rounded-full opacity-50"
          style={{ background: "radial-gradient(circle, oklch(0.90 0.04 75) 0%, oklch(0.95 0.02 75 / 0) 70%)" }} />
      </div>

      {/* Contenido */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm">

          {/* Logo */}
          <div className="mb-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
              <Dumbbell className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              RepStack
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {modo === 'login' ? 'Iniciá sesión' : 'Creá tu cuenta'}
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {modo === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  placeholder="Tu nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="h-12"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nombre@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button type="submit" className="h-12 w-full">
              {modo === 'login' ? 'Ingresar' : 'Registrarse'}
            </Button>
          </form>

          {/* Link cambiar modo */}
          <p className="mt-8 text-center text-sm text-muted-foreground">
            {modo === 'login' ? '¿No tenés cuenta?' : '¿Ya tenés cuenta?'}{' '}
            <button
              type="button"
              onClick={() => setModo(modo === 'login' ? 'register' : 'login')}
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              {modo === 'login' ? 'Registrate' : 'Iniciá sesión'}
            </button>
          </p>

        </div>
      </div>
    </div>
  )
}