import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { crearSesion, getSesionPorFecha, agregarEjercicio, eliminarEjercicio, getTiposEjercicio } from '../api/client'
import { neu, colors, pageWrapper } from '../styles/neu'
import { Dumbbell, Trash2, History, LogOut, Settings } from 'lucide-react'
import ScrollWheel from '../components/ui/ScrollWheel'
import Select from '../components/ui/Select'

export default function Home() {
  const navigate = useNavigate()
  const getLocalDate = () => {
    const d = new Date()
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  const hoy = getLocalDate()

  const [sesion, setSesion] = useState(null)
  const [ejercicios, setEjercicios] = useState([])
  const [tiposEjercicio, setTiposEjercicio] = useState([])
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null)
  const [agarre, setAgarre] = useState('')
  const [posicionManos, setPosicionManos] = useState('')
  const [series, setSeries] = useState('')
  const [repeticiones, setRepeticiones] = useState('')
  const [peso, setPeso] = useState('')
  const [presionado, setPresionado] = useState(false)
  const [usuario, setUsuario] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/')
      return
    }
    const payload = JSON.parse(atob(token.split('.')[1]))
    setUsuario(payload)
    cargarSesion()
    cargarTipos()
  }, [])

  const cargarTipos = async () => {
    const res = await getTiposEjercicio()
    setTiposEjercicio(res.data)
  }

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

  const handleTipoChange = (e) => {
    const tipoId = parseInt(e.target.value)
    const tipo = tiposEjercicio.find(t => t.id === tipoId)
    setTipoSeleccionado(tipo)
    setAgarre('')
    setPosicionManos('')
  }

  const handleAgregar = async () => {
    if (!tipoSeleccionado) return
    const datos = {
      tipo_ejercicio_id: tipoSeleccionado.id,
      tipo_agarre: tipoSeleccionado.tiene_agarre && agarre ? agarre : null,
      posicion_manos: tipoSeleccionado.tiene_posicion_manos && posicionManos ? posicionManos : null,
      series: series ? parseInt(series) : null,
      repeticiones: repeticiones ? parseInt(repeticiones) : null,
      peso_kg: tipoSeleccionado.tiene_kg && peso ? parseFloat(peso) : null,
    }
    const res = await agregarEjercicio(sesion.id, datos)
    setEjercicios([...ejercicios, res.data])
    setTipoSeleccionado(null)
    setAgarre('')
    setPosicionManos('')
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

  const opcionesAgarre = tipoSeleccionado?.opciones?.filter(o => o.tipo === 'agarre') || []
  const opcionesPosicion = tipoSeleccionado?.opciones?.filter(o => o.tipo === 'posicion') || []

  return (
    <div style={pageWrapper}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginBottom: 24 }}>
        {usuario?.is_admin === 1 && (
          <button style={neu.iconButton} onClick={() => navigate('/admin')}>
            <Settings size={18} />
          </button>
        )}
        <button style={neu.iconButton} onClick={() => navigate('/historial')}>
          <History size={18} />
        </button>
        <button style={neu.iconButton} onClick={handleLogout}>
          <LogOut size={18} />
        </button>
      </div>

      {/* Layout: Fecha + Card lado a lado en escritorio */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginBottom: 32 }}>
        
        {/* Izquierda: Fecha */}
        <div style={{ flex: '1 1 300px', minWidth: '40%', display: 'flex', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.muted, marginBottom: 4 }}>
              Hoy
            </p>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: colors.text, letterSpacing: '-0.02em', textTransform: 'capitalize' }}>
              {fechaFormateada}
            </h1>
          </div>
        </div>

        {/* Derecha: Card agregar ejercicio */}
        <div style={{ flex: '1 1 300px', minWidth: '40%' }}>
          <div style={neu.card}>
          <p style={{ ...neu.label, marginBottom: 16 }}>Agregar ejercicio</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Select
            value={tipoSeleccionado?.id || ''}
            onChange={(v) => {
              const tipo = tiposEjercicio.find(t => t.id === v)
              setTipoSeleccionado(tipo)
              setAgarre('')
              setPosicionManos('')
            }}
            options={tiposEjercicio.map(t => ({ value: t.id, label: t.nombre }))}
            placeholder="Seleccionar ejercicio"
          />

          {tipoSeleccionado && (
            <>
              {tipoSeleccionado.tiene_agarre === 1 && opcionesAgarre.length > 0 && (
                <Select
                  value={agarre}
                  onChange={setAgarre}
                  options={opcionesAgarre.map(o => ({ value: o.valor, label: o.valor }))}
                  placeholder="Tipo de agarre"
                />
              )}

              {tipoSeleccionado.tiene_posicion_manos === 1 && opcionesPosicion.length > 0 && (
                <Select
                  value={posicionManos}
                  onChange={setPosicionManos}
                  options={opcionesPosicion.map(o => ({ value: o.valor, label: o.valor }))}
                  placeholder="Posición de manos"
                />
              )}

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
                {tipoSeleccionado.tiene_kg === 1 && (
                  <ScrollWheel
                    label="Kg"
                    value={peso ? parseInt(peso) : 0}
                    onChange={(v) => setPeso(v)}
                    min={0}
                    max={300}
                  />
                )}
              </div>
            </>
          )}

          <button
            onClick={handleAgregar}
            disabled={!tipoSeleccionado}
            style={{
              ...neu.button,
              ...(presionado ? neu.buttonPressed : {}),
              ...(!tipoSeleccionado ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
            }}
            onMouseDown={() => tipoSeleccionado && setPresionado(true)}
            onMouseUp={() => setPresionado(false)}
            onMouseLeave={() => setPresionado(false)}
            onTouchStart={() => tipoSeleccionado && setPresionado(true)}
            onTouchEnd={() => setPresionado(false)}
          >
            Agregar
          </button>
          </div>
          </div>
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
              <p style={{ fontWeight: 700, color: colors.text, marginBottom: 4 }}>
                {e.tipo_ejercicio?.nombre || 'Ejercicio'}
              </p>
              <p style={{ fontSize: 13, color: colors.muted }}>
                {e.tipo_agarre && `${e.tipo_agarre}`}
                {e.tipo_agarre && e.posicion_manos && ' / '}
                {e.posicion_manos && `${e.posicion_manos}`}
                {e.tipo_agarre || e.posicion_manos ? ' — ' : ''}
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