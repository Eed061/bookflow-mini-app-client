// Екран 3: Вибір часу
import { useState, useEffect } from 'react'
import { apiGet } from '../api.js'
import { Skeleton, fmtDateFull } from '../ui.jsx'

export default function TimeScreen({ service, date, onSelect }) {
  const [slots,   setSlots]   = useState([])
  const [loading, setLoading] = useState(true)
  const [picked,  setPicked]  = useState(null)

  useEffect(() => {
    if (!date) return
    setLoading(true)
    apiGet('slots', { date, service_id: service?.id || '' })
      .then(d => setSlots(d.slots))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [date, service])

  const freeCount = slots.filter(s => s.available).length

  function pick(slot) {
    if (!slot.available) return
    setPicked(slot.time)
    setTimeout(() => onSelect(slot.time), 180)
  }

  function slotVariant(slot) {
    if (picked === slot.time) return 'selected'
    if (!slot.available)      return slot.status  // 'booked' | 'blocked' | 'past'
    if (freeCount === 1)      return 'last'
    return 'free'
  }

  const SLOT_STYLE = {
    selected: { bg: 'var(--btn)',     color: 'var(--btn-text)',  cursor: 'pointer' },
    free:     { bg: '#34c75918',      color: '#34c759',          cursor: 'pointer' },
    last:     { bg: '#ff950018',      color: '#ff9500',          cursor: 'pointer' },
    booked:   { bg: 'var(--bg2)',     color: 'var(--hint)',      cursor: 'default', opacity: .5 },
    blocked:  { bg: 'var(--bg2)',     color: 'var(--hint)',      cursor: 'default', opacity: .4 },
    past:     { bg: 'var(--bg2)',     color: 'var(--hint)',      cursor: 'default', opacity: .3 },
  }

  return (
    <div style={{ padding: 20, animation: 'slideIn .22s ease' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Оберіть час</h1>
        <p style={{ color: 'var(--hint)', fontSize: 14, marginTop: 4 }}>
          {fmtDateFull(date)}
        </p>
      </div>

      {/* Попередження якщо мало місць */}
      {!loading && freeCount > 0 && freeCount <= 2 && (
        <div style={{
          background: '#ff950015', borderRadius: 10,
          padding: '10px 14px', marginBottom: 16,
          fontSize: 14, color: '#ff9500', fontWeight: 600,
        }}>
          🔥 Залишилось лише {freeCount} {freeCount === 1 ? 'слот' : 'слоти'}!
        </div>
      )}

      {!loading && freeCount === 0 && (
        <div style={{
          background: '#ff3b3015', borderRadius: 10,
          padding: '10px 14px', marginBottom: 16,
          fontSize: 14, color: '#ff3b30',
        }}>
          😔 На цю дату немає вільних слотів. Оберіть іншу дату.
        </div>
      )}

      {/* Сітка слотів */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {loading
          ? [1,2,3,4,5,6].map(i => <Skeleton key={i} h={48} mb={0} />)
          : slots.map(slot => {
              const v = slotVariant(slot)
              const st = SLOT_STYLE[v] || SLOT_STYLE.past
              return (
                <button key={slot.time} onClick={() => pick(slot)}
                  style={{
                    padding: '12px 0', borderRadius: 10, border: 'none',
                    fontSize: 16, fontWeight: 700,
                    transition: 'all .15s',
                    ...st,
                  }}>
                  {slot.time}
                </button>
              )
            })
        }
      </div>

      {/* Легенда */}
      {!loading && slots.length > 0 && (
        <div style={{ display: 'flex', gap: 14, fontSize: 12, color: 'var(--hint)', marginTop: 16, flexWrap: 'wrap' }}>
          <span style={{ color: '#34c759' }}>● Вільно</span>
          <span style={{ color: '#ff9500' }}>● Останній</span>
          <span>● Зайнято</span>
        </div>
      )}
    </div>
  )
}
