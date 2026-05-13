import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSesiones } from '../api/client'
import { neu, colors, pageWrapper } from '../styles/neu'
import { ArrowLeft, Dumbbell } from 'lucide-react'

export default function Historial() {
  const navigate = useNavigate()
  const [sesiones, setSesiones] = useState([])

  useEffect(() => {
    getSesiones().then((res) => setSesiones(res.data))
  }, [])

  return (
    <div style={pageWrapper}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <button style={neu.iconButton} onClick={() => navigate('/home')}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.muted, marginBottom: 2 }}>
            RepStack
          </p>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: colors.text, letterSpacing: '-0.02em' }}>
            Historial
          </h1>
        </div>
      </div>

      {/* Lista */}
      {sesiones.length === 0 && (
        <div style={{ ...neu.card_sm, textAlign: 'center', padding: 32 }}>
          <Dumbbell size={28} color={colors.muted} style={{ margin: '0 auto 12px' }} />
          <p style={{ color: colors.muted, fontSize: 14 }}>No hay sesiones anteriores</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {sesiones.map((s) => (
          <div
            key={s.id}
            style={{ ...neu.card_sm, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => navigate(`/historial/${s.fecha}`)}
          >
            <div>
              <p style={{ fontWeight: 700, color: colors.text, marginBottom: 4 }}>{s.fecha}</p>
              <p style={{ fontSize: 13, color: colors.muted }}>
                {s.ejercicios.length} ejercicio{s.ejercicios.length !== 1 ? 's' : ''}
              </p>
            </div>
            <p style={{ color: colors.muted, fontSize: 18 }}>→</p>
          </div>
        ))}
      </div>

    </div>
  )
}