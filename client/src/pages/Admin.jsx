import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTiposEjercicio, crearTipoEjercicio, actualizarTipoEjercicio, eliminarTipoEjercicio } from '../api/client'
import { neu, colors, pageWrapper } from '../styles/neu'
import { ArrowLeft, Plus, Trash2, Edit2, Save, X } from 'lucide-react'

export default function Admin() {
  const navigate = useNavigate()
  const [tipos, setTipos] = useState([])
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState({
    nombre: '',
    slug: '',
    tiene_kg: 0,
    tiene_agarre: 0,
    tiene_posicion_manos: 0,
    opciones: []
  })
  const [nuevaOpcion, setNuevaOpcion] = useState({ tipo: 'agarre', valor: '' })

  useEffect(() => { cargarTipos() }, [])

  const cargarTipos = async () => {
    const res = await getTiposEjercicio()
    setTipos(res.data)
  }

  const handleNuevo = () => {
    setEditando(-1)
    setForm({
      nombre: '',
      slug: '',
      tiene_kg: 0,
      tiene_agarre: 0,
      tiene_posicion_manos: 0,
      opciones: []
    })
    setNuevaOpcion({ tipo: 'agarre', valor: '' })
  }

  const handleEditar = (tipo) => {
    setEditando(tipo.id)
    setForm({
      nombre: tipo.nombre,
      slug: tipo.slug,
      tiene_kg: tipo.tiene_kg,
      tiene_agarre: tipo.tiene_agarre,
      tiene_posicion_manos: tipo.tiene_posicion_manos,
      opciones: [...tipo.opciones]
    })
    setNuevaOpcion({ tipo: 'agarre', valor: '' })
  }

  const handleCancelar = () => {
    setEditando(null)
    setForm({
      nombre: '',
      slug: '',
      tiene_kg: 0,
      tiene_agarre: 0,
      tiene_posicion_manos: 0,
      opciones: []
    })
  }

  const handleGuardar = async () => {
    const datos = {
      nombre: form.nombre,
      slug: form.slug,
      tiene_kg: form.tiene_kg ? 1 : 0,
      tiene_agarre: form.tiene_agarre ? 1 : 0,
      tiene_posicion_manos: form.tiene_posicion_manos ? 1 : 0,
      opciones: form.opciones
    }

    if (editando === -1) {
      await crearTipoEjercicio(datos)
    } else {
      await actualizarTipoEjercicio(editando, datos)
    }

    await cargarTipos()
    handleCancelar()
  }

  const handleEliminar = async (id) => {
    if (confirm('¿Eliminar este tipo de ejercicio?')) {
      await eliminarTipoEjercicio(id)
      await cargarTipos()
    }
  }

  const agregarOpcion = () => {
    if (nuevaOpcion.valor.trim()) {
      setForm({ ...form, opciones: [...form.opciones, { tipo: nuevaOpcion.tipo, valor: nuevaOpcion.valor }] })
      setNuevaOpcion({ ...nuevaOpcion, valor: '' })
    }
  }

  const eliminarOpcion = (index) => {
    setForm({ ...form, opciones: form.opciones.filter((_, i) => i !== index) })
  }

  return (
    <div style={pageWrapper}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <button style={{ ...neu.iconButton, display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => navigate('/home')}>
          <ArrowLeft size={18} />
          Volver
        </button>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: colors.text }}>Admin - Tipos de Ejercicio</h1>
        <div style={{ width: 60 }} />
      </div>

      <button
        onClick={handleNuevo}
        style={{ ...neu.button, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}
      >
        <Plus size={18} />
        Nuevo Tipo
      </button>

      {(editando !== null) && (
        <div style={{ ...neu.card, marginBottom: 24 }}>
          <p style={{ ...neu.label, marginBottom: 16 }}>
            {editando === -1 ? 'Nuevo Tipo de Ejercicio' : 'Editar Tipo'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              placeholder="Nombre"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              style={neu.input}
            />
            <input
              placeholder="Slug (identificador)"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              style={neu.input}
            />
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={form.tiene_kg === 1}
                  onChange={(e) => setForm({ ...form, tiene_kg: e.target.checked ? 1 : 0 })}
                />
                Tiene Kg
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={form.tiene_agarre === 1}
                  onChange={(e) => setForm({ ...form, tiene_agarre: e.target.checked ? 1 : 0 })}
                />
                Tiene Agarre
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={form.tiene_posicion_manos === 1}
                  onChange={(e) => setForm({ ...form, tiene_posicion_manos: e.target.checked ? 1 : 0 })}
                />
                Tiene Posición de Manos
              </label>
            </div>

            <div style={{ borderTop: '1px solid #eee', paddingTop: 12 }}>
              <p style={{ fontSize: 13, color: colors.muted, marginBottom: 8 }}>Opciones de atributos</p>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <select
                  value={nuevaOpcion.tipo}
                  onChange={(e) => setNuevaOpcion({ ...nuevaOpcion, tipo: e.target.value })}
                  style={{ ...neu.input, padding: '8px 12px', width: 'auto' }}
                >
                  <option value="agarre">Agarre</option>
                  <option value="posicion">Posición</option>
                </select>
                <input
                  placeholder="Valor"
                  value={nuevaOpcion.valor}
                  onChange={(e) => setNuevaOpcion({ ...nuevaOpcion, valor: e.target.value })}
                  style={{ ...neu.input, flex: 1 }}
                />
                <button onClick={agregarOpcion} style={{ ...neu.button, padding: '8px 16px' }}>Agregar</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {form.opciones.map((op, i) => (
                  <span key={i} style={{ background: '#f0f0f0', padding: '4px 8px', borderRadius: 4, fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
                    {op.tipo}: {op.valor}
                    <X size={14} style={{ cursor: 'pointer' }} onClick={() => eliminarOpcion(i)} />
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button onClick={handleGuardar} style={{ ...neu.button, display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                <Save size={18} />
                Guardar
              </button>
              <button onClick={handleCancelar} style={{ ...neu.buttonSecondary, display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                <X size={18} />
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {tipos.map((tipo) => (
          <div key={tipo.id} style={{ ...neu.card_sm, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontWeight: 700, color: colors.text, marginBottom: 4 }}>{tipo.nombre}</p>
              <p style={{ fontSize: 12, color: colors.muted }}>
                {tipo.tiene_kg && 'Kg '}
                {tipo.tiene_agarre && 'Agarre '}
                {tipo.tiene_posicion_manos && 'Posición '}
                | Opciones: {tipo.opciones.length}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => handleEditar(tipo)} style={{ ...neu.iconButton, width: 36, height: 36 }}>
                <Edit2 size={15} />
              </button>
              <button onClick={() => handleEliminar(tipo.id)} style={{ ...neu.iconButton, width: 36, height: 36, color: colors.danger }}>
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}