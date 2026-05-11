import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getSesionPorFecha } from '../api/client'

function Detalle() {
  const { fecha } = useParams()
  const navigate = useNavigate()
  const [sesion, setSesion] = useState(null)

  useEffect(() => {
    getSesionPorFecha(fecha).then((res) => setSesion(res.data))
  }, [fecha])

  if (!sesion) return <p style={{ textAlign: 'center', marginTop: 40 }}>Cargando...</p>

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <button onClick={() => navigate('/historial')} style={btnSecundario}>← Volver</button>
        <h1 style={{ fontSize: 22 }}>{fecha}</h1>
      </div>

      {sesion.ejercicios.length === 0 && (
        <p style={{ color: '#666', textAlign: 'center' }}>No hay ejercicios en esta sesión</p>
      )}

      {sesion.ejercicios.map((e) => (
        <div key={e.id} style={cardStyle}>
          <p style={{ fontWeight: 'bold', marginBottom: 4 }}>{e.nombre}</p>
          <p style={{ color: '#666', fontSize: 14 }}>
            {e.series && `${e.series} series`}
            {e.repeticiones && ` × ${e.repeticiones} reps`}
            {e.peso_kg && ` — ${e.peso_kg} kg`}
          </p>
        </div>
      ))}
    </div>
  )
}

const btnSecundario = {
  padding: '8px 16px',
  borderRadius: 8,
  border: '1px solid #ddd',
  background: 'transparent',
  cursor: 'pointer',
  fontSize: 14,
}

const cardStyle = {
  padding: '16px',
  borderRadius: 8,
  border: '1px solid #ddd',
  marginBottom: 12,
}

export default Detalle