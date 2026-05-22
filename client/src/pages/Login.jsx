import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, register } from '../api/client'
import { Eye, EyeOff } from 'lucide-react'
import { neu, colors, pageWrapper } from '../styles/neu'


export default function Login() {
  const [modo, setModo] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [presionado, setPresionado] = useState(false)
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
    <div className="min-h-screen flex flex-col justify-center items-center px-6 py-12"
        style={{ background: '#e8e8e8' }}>

      {/* Título fuera de la card */}
      <div className="w-full max-w-sm mb-10">
        <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#aaa', marginBottom: 6 }}>
          Tu entrenamiento
        </p>
        <h1 style={{
          fontSize: 64,
          fontWeight: 900,
          letterSpacing: '-0.04em',
          lineHeight: 1,
          color: '#2a2a2a',
        }}>
          Rep<br />Stack
        </h1>
      </div>

      {/* Card neumórfica */}
      <div className="w-full max-w-sm" style={neu.card}>
        <p style={{ fontSize: 18, fontWeight: 700, color: '#2a2a2a', marginBottom: 28 }}>
          {modo === 'login' ? 'Iniciá sesión' : 'Creá tu cuenta'}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {modo === 'register' && (
            <div>
              <label style={neu.label}>Nombre</label>
              <input
                placeholder="Tu nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                style={neu.input}
              />
            </div>
          )}

          <div>
            <label style={neu.label}>Email</label>
            <input
              type="email"
              placeholder="nombre@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={neu.input}
              required
            />
          </div>

          <div>
            <label style={neu.label}>Contraseña</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...neu.input, paddingRight: 44 }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#aaa',
                  padding: 0,
                  display: 'flex',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <p style={{ fontSize: 13, color: '#e74c3c' }}>{error}</p>}

          <button
  type="submit"
  style={{
    ...neu.button,
    boxShadow: presionado
      ? 'inset 4px 4px 8px rgba(0,0,0,0.12), inset -4px -4px 8px rgba(255,255,255,0.9)'
      : '6px 6px 12px rgba(0,0,0,0.15), -6px -6px 12px rgba(255,255,255,0.9)',
    transform: presionado ? 'scale(0.98)' : 'scale(1)',
    transition: 'all 0.1s ease',
  }}
  onMouseDown={() => setPresionado(true)}
  onMouseUp={() => setPresionado(false)}
  onMouseLeave={() => setPresionado(false)}
  onTouchStart={() => setPresionado(true)}
  onTouchEnd={() => setPresionado(false)}
>
  {modo === 'login' ? 'Ingresar' : 'Registrarse'}
</button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: '#aaa' }}>
          {modo === 'login' ? '¿No tenés cuenta?' : '¿Ya tenés cuenta?'}{' '}
          <button
            type="button"
            onClick={() => setModo(modo === 'login' ? 'register' : 'login')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, color: '#555', fontSize: 13 }}
          >
            {modo === 'login' ? 'Registrate' : 'Iniciá sesión'}
          </button>
        </p>
      </div>
    </div>
  )
}