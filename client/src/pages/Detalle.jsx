import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getSesionPorFecha } from '../api/client'
import { neu, colors, pageWrapper } from '../styles/neu'
import { ArrowLeft } from 'lucide-react'

export default function Detalle() {
  const { fecha } = useParams()
  const navigate = useNavigate()
  const [sesion, setSesion] = useState(null)

  useEffect(() => {
    getSesionPorFecha(fecha).then((res) => setSesion(res.data))
  }, [fecha])

  if (!sesion) return (
    <div style={{ ...pageWrapper, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: colors.muted }}>Cargando...</p>
    </div>
  )

  return (
    <div style={pageWrapper}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <button style={neu.iconButton} onClick={() => navigate('/historial')}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.muted, marginBottom: 2 }}>
            Sesión
          </p>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: colors.text, letterSpacing: '-0.02em' }}>
            {fecha}
          </h1>
        </div>
      </div>

      {/* Ejercicios */}
      {sesion.ejercicios.length === 0 && (
        <div style={{ ...neu.card_sm, textAlign: 'center', padding: 32 }}>
          <p style={{ color: colors.muted, fontSize: 14 }}>No hay ejercicios en esta sesión</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {sesion.ejercicios.map((e) => (
          <div key={e.id} style={neu.card_sm}>
            <p style={{ fontWeight: 700, color: colors.text, marginBottom: 4 }}>{e.nombre}</p>
            <p style={{ fontSize: 13, color: colors.muted }}>
              {e.series && `${e.series} series`}
              {e.repeticiones && ` × ${e.repeticiones} reps`}
              {e.peso_kg && ` — ${e.peso_kg} kg`}
            </p>
          </div>
        ))}
      </div>

    </div>
  )
}