import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { crearSesion, getSesionPorFecha, agregarEjercicio, eliminarEjercicio } from '../api/client'
import { neu, colors, pageWrapper } from '../styles/neu'
import { Dumbbell, Trash2, History, LogOut, User } from 'lucide-react'
import ScrollWheel from '../components/ui/ScrollWheel'

export default function Home() {
  const navigate = useNavigate()
  const hoy = new Date().toISOString().split('T')[0]

  const [sesion, setSesion] = useState(null)
  const [ejercicios, setEjercicios] = useState([])
  const [nombre, setNombre] = useState('')
  const [series, setSeries] = useState('')
  const [repeticiones, setRepeticiones] = useState('')
  const [peso, setPeso] = useState('')
  const [presionado, setPresionado] = useState(false)

  useEffect(() => { cargarSesion() }, [])

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

  const fechaFormateada = new Date().toLocaleDateString('es-AR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div style={pageWrapper}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.muted, marginBottom: 4 }}>
            Hoy
          </p>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: colors.text, letterSpacing: '-0.02em', textTransform: 'capitalize' }}>
            {fechaFormateada}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={neu.iconButton} onClick={() => navigate('/historial')}>
            <History size={18} />
          </button>
          <button style={neu.iconButton} onClick={handleLogout}>
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Card agregar ejercicio */}
      <div style={{ ...neu.card, marginBottom: 24 }}>
        <p style={{ ...neu.label, marginBottom: 16 }}>Agregar ejercicio</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            placeholder="Nombre del ejercicio"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            style={neu.input}
          />
          {/* reemplazá el grid de inputs numéricos por esto */}
          <div style={{ display: 'flex', justifyContent: 'space-around', paddingTop: 8 }}>
            <ScrollWheel
              label="Series"
              value={series ? parseInt(series) : 0}
              onChange={(v) => setSeries(v)}
              min={0}
              max={20}
            />
            <ScrollWheel
              label="Reps"
              value={repeticiones ? parseInt(repeticiones) : 0}
              onChange={(v) => setRepeticiones(v)}
              min={0}
              max={50}
            />
            <ScrollWheel
              label="Kg"
              value={peso ? parseInt(peso) : 0}
              onChange={(v) => setPeso(v)}
              min={0}
              max={300}
            />
          </div>
          <button
            onClick={handleAgregar}
            style={{
              ...neu.button,
              ...(presionado ? neu.buttonPressed : {}),
            }}
            onMouseDown={() => setPresionado(true)}
            onMouseUp={() => setPresionado(false)}
            onMouseLeave={() => setPresionado(false)}
            onTouchStart={() => setPresionado(true)}
            onTouchEnd={() => setPresionado(false)}
          >
            Agregar
          </button>
        </div>
      </div>

      {/* Lista ejercicios */}
      <p style={neu.label}>Ejercicios de hoy ({ejercicios.length})</p>

      {ejercicios.length === 0 && (
        <div style={{ ...neu.card_sm, textAlign: 'center', padding: 32 }}>
          <Dumbbell size={28} color={colors.muted} style={{ margin: '0 auto 12px' }} />
          <p style={{ color: colors.muted, fontSize: 14 }}>No hay ejercicios todavía</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {ejercicios.map((e) => (
          <div key={e.id} style={{ ...neu.card_sm, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontWeight: 700, color: colors.text, marginBottom: 4 }}>{e.nombre}</p>
              <p style={{ fontSize: 13, color: colors.muted }}>
                {e.series && `${e.series} series`}
                {e.repeticiones && ` × ${e.repeticiones} reps`}
                {e.peso_kg && ` — ${e.peso_kg} kg`}
              </p>
            </div>
            <button
              onClick={() => handleEliminar(e.id)}
              style={{ ...neu.iconButton, width: 36, height: 36 }}
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}