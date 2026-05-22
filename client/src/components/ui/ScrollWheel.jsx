import { useRef, useState, useEffect } from 'react'

export default function ScrollWheel({ value, onChange, min = 0, max = 100, label }) {
  const containerRef = useRef(null)
  const isDragging = useRef(false)
  const startY = useRef(0)
  const startValue = useRef(0)
  const deltaAccumulator = useRef(0)
  const [scrollOffset, setScrollOffset] = useState(0)

  const current = value || min

  useEffect(() => {
    setScrollOffset(0)
  }, [value])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const handleWheel = (e) => {
      e.preventDefault()
      deltaAccumulator.current += e.deltaY
      if (Math.abs(deltaAccumulator.current) >= 30) {
        const delta = deltaAccumulator.current > 0 ? 1 : -1
        const newVal = Math.min(max, Math.max(min, (value || min) + delta))
        onChange(newVal)
        deltaAccumulator.current = 0
      }
    }

    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [value, min, max, onChange])

  const handleMouseDown = (e) => {
    isDragging.current = true
    startY.current = e.clientY
    startValue.current = value || min
    setScrollOffset(0)
  }

  const handleMouseMove = (e) => {
    if (!isDragging.current) return
    const delta = startY.current - e.clientY
    setScrollOffset(delta)
    const step = Math.round(delta / 32)
    const newVal = Math.min(max, Math.max(min, startValue.current + step))
    onChange(newVal)
  }

  const handleMouseUp = () => {
    isDragging.current = false
    setScrollOffset(0)
  }

  const handleTouchStart = (e) => {
    startY.current = e.touches[0].clientY
    startValue.current = value || min
    setScrollOffset(0)
  }

  const handleTouchMove = (e) => {
    e.preventDefault()
    const delta = startY.current - e.touches[0].clientY
    setScrollOffset(delta)
    const step = Math.round(delta / 32)
    const newVal = Math.min(max, Math.max(min, startValue.current + step))
    onChange(newVal)
  }

  const getDisplayItems = () => {
    const items = []
    for (let offset = -2; offset <= 2; offset++) {
      const num = current + offset
      if (num >= min && num <= max) {
        items.push({ num, offset })
      }
    }
    return items
  }

  const displayItems = getDisplayItems()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <span style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#aaa' }}>
        {label}
      </span>
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        style={{
          width: 80,
          height: 160,
          borderRadius: 20,
          background: '#e8e8e8',
          boxShadow: 'inset 4px 4px 10px rgba(0,0,0,0.12), inset -4px -4px 10px rgba(255,255,255,0.9)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'ns-resize',
          userSelect: 'none',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{
          position: 'absolute', top: '50%', left: 12, right: 12,
          height: 1, background: 'rgba(0,0,0,0.1)', transform: 'translateY(-16px)',
        }} />
        <div style={{
          position: 'absolute', top: '50%', left: 12, right: 12,
          height: 1, background: 'rgba(0,0,0,0.1)', transform: 'translateY(16px)',
        }} />

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transition: isDragging.current ? 'none' : 'transform 200ms ease-out',
          transform: `translateY(${scrollOffset}px)`,
        }}>
          {displayItems.map((item, i) => {
            const distance = Math.abs(item.offset)
            const opacity = distance === 0 ? 1 : distance === 1 ? 0.4 : 0.15
            const fontSize = distance === 0 ? 26 : distance === 1 ? 18 : 14
            const fontWeight = distance === 0 ? 800 : 400

            return (
              <div key={i} style={{
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize,
                fontWeight,
                color: '#2a2a2a',
                opacity,
                lineHeight: 1,
              }}>
                {item.num}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}