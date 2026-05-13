import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

export default function Select({ value, onChange, options, placeholder = "Seleccionar", style = {} }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selected = options.find(o => o.value === value)

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', ...style }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          background: '#e8e8e8',
          border: 'none',
          borderRadius: 12,
          padding: '14px 16px',
          fontSize: 15,
          color: selected ? '#333' : '#aaa',
          textAlign: 'left',
          cursor: 'pointer',
          outline: 'none',
          boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.12), inset -4px -4px 8px rgba(255,255,255,0.9)',
          boxSizing: 'border-box',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <ChevronDown size={18} style={{ color: '#999', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: '110%',
          left: 0,
          right: 0,
          background: '#e8e8e8',
          borderRadius: 12,
          boxShadow: '8px 8px 16px rgba(0,0,0,0.15), -8px -8px 16px rgba(255,255,255,0.9)',
          zIndex: 100,
          overflow: 'hidden',
          maxHeight: 200,
          overflowY: 'auto',
        }}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value)
                setOpen(false)
              }}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                padding: '12px 16px',
                fontSize: 15,
                color: option.value === value ? '#000' : '#555',
                textAlign: 'left',
                cursor: 'pointer',
                fontWeight: option.value === value ? 600 : 400,
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(0,0,0,0.05)'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}