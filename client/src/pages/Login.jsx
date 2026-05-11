import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, register } from '../api/client'

function Login() {
  const [modo, setModo] = useState('login')
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async () => {
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
    } catch (e) {
      setError('Email o contraseña incorrectos')
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: '0 24px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: 24 }}>RepStack</h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: 40 }}>
        {modo === 'login' ? 'Iniciá sesión' : 'Creá tu cuenta'}
      </p>

      {modo === 'register' && (
        <input
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={inputStyle}
        />
      )}

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={inputStyle}
      />

      <input
        placeholder="Contraseña"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={inputStyle}
      />

      {error && <p style={{ color: 'red', marginBottom: 12 }}>{error}</p>}

      <button onClick={handleSubmit} style={buttonStyle}>
        {modo === 'login' ? 'Ingresar' : 'Registrarse'}
      </button>

      <p style={{ textAlign: 'center', marginTop: 16, color: '#666' }}>
        {modo === 'login' ? '¿No tenés cuenta?' : '¿Ya tenés cuenta?'}{' '}
        <span
          onClick={() => setModo(modo === 'login' ? 'register' : 'login')}
          style={{ color: '#000', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {modo === 'login' ? 'Registrate' : 'Iniciá sesión'}
        </span>
      </p>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  marginBottom: 12,
  borderRadius: 8,
  border: '1px solid #ddd',
  fontSize: 16,
  boxSizing: 'border-box',
}

const buttonStyle = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: 8,
  border: 'none',
  background: '#000',
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
  cursor: 'pointer',
}

export default Login