import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSesiones } from '../api/client'

function Historial() {
  const navigate = useNavigate()
  const [sesiones, setSesiones] = useState([])

  useEffect(() => {
    getSesiones().then((res) => setSesiones(res.data))
  }, [])

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <button onClick={() => navigate('/home')} style={btnSecundario}>← Volver</button>
        <h1 style={{ fontSize: 22 }}>Historial</h1>
      </div>

      {sesiones.length === 0 && (
        <p style={{ color: '#666', textAlign: 'center' }}>No hay sesiones anteriores</p>
      )}

      {sesiones.map((s) => (
        <div key={s.id} style={cardStyle} onClick={() => navigate(`/historial/${s.fecha}`)}>
          <div>
            <p style={{ fontWeight: 'bold', marginBottom: 4 }}>{s.fecha}</p>
            <p style={{ color: '#666', fontSize: 14 }}>
              {s.ejercicios.length} ejercicio{s.ejercicios.length !== 1 ? 's' : ''}
            </p>
          </div>
          <span style={{ color: '#999' }}>→</span>
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
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px',
  borderRadius: 8,
  border: '1px solid #ddd',
  marginBottom: 12,
  cursor: 'pointer',
}

export default Historial