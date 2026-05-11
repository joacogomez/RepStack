import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { crearSesion, getSesionPorFecha, agregarEjercicio, eliminarEjercicio } from '../api/client'

function Home() {
  const navigate = useNavigate()
  const hoy = new Date().toISOString().split('T')[0]

  const [sesion, setSesion] = useState(null)
  const [ejercicios, setEjercicios] = useState([])
  const [nombre, setNombre] = useState('')
  const [series, setSeries] = useState('')
  const [repeticiones, setRepeticiones] = useState('')
  const [peso, setPeso] = useState('')

  useEffect(() => {
    cargarSesion()
  }, [])

  const cargarSesion = async () => {
    try {
      const res = await getSesionPorFecha(hoy)
      setSesion(res.data)
      setEjercicios(res.data.ejercicios)
    } catch {
      const res = await crearSesion({ fecha: hoy })
      setSesion(res.data)
      setEjercicios([])
    }
  }

  const handleAgregar = async () => {
    if (!nombre.trim()) return
    const datos = {
      nombre,
      series: series ? parseInt(series) : null,
      repeticiones: repeticiones ? parseInt(repeticiones) : null,
      peso_kg: peso ? parseFloat(peso) : null,
    }
    const res = await agregarEjercicio(sesion.id, datos)
    setEjercicios([...ejercicios, res.data])
    setNombre('')
    setSeries('')
    setRepeticiones('')
    setPeso('')
  }

  const handleEliminar = async (id) => {
    await eliminarEjercicio(id)
    setEjercicios(ejercicios.filter((e) => e.id !== id))
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22 }}>{hoy}</h1>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => navigate('/historial')} style={btnSecundario}>Historial</button>
          <button onClick={handleLogout} style={btnSecundario}>Salir</button>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <input placeholder="Ejercicio" value={nombre} onChange={(e) => setNombre(e.target.value)} style={inputStyle} />
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input placeholder="Series" value={series} onChange={(e) => setSeries(e.target.value)} style={{ ...inputStyle, marginBottom: 0 }} type="number" />
          <input placeholder="Reps" value={repeticiones} onChange={(e) => setRepeticiones(e.target.value)} style={{ ...inputStyle, marginBottom: 0 }} type="number" />
          <input placeholder="Kg" value={peso} onChange={(e) => setPeso(e.target.value)} style={{ ...inputStyle, marginBottom: 0 }} type="number" />
        </div>
        <button onClick={handleAgregar} style={btnPrimario}>Agregar ejercicio</button>
      </div>

      <div>
        {ejercicios.length === 0 && (
          <p style={{ color: '#666', textAlign: 'center' }}>No hay ejercicios todavía</p>
        )}
        {ejercicios.map((e) => (
          <div key={e.id} style={cardStyle}>
            <div>
              <p style={{ fontWeight: 'bold', marginBottom: 4 }}>{e.nombre}</p>
              <p style={{ color: '#666', fontSize: 14 }}>
                {e.series && `${e.series} series`}
                {e.repeticiones && ` × ${e.repeticiones} reps`}
                {e.peso_kg && ` — ${e.peso_kg} kg`}
              </p>
            </div>
            <button onClick={() => handleEliminar(e.id)} style={btnEliminar}>✕</button>
          </div>
        ))}
      </div>
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

const btnPrimario = {
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

const btnSecundario = {
  padding: '8px 16px',
  borderRadius: 8,
  border: '1px solid #ddd',
  background: 'transparent',
  cursor: 'pointer',
  fontSize: 14,
}

const btnEliminar = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: 18,
  color: '#999',
}

const cardStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px',
  borderRadius: 8,
  border: '1px solid #ddd',
  marginBottom: 12,
}

export default Home