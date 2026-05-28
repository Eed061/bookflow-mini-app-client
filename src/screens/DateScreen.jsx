// Екран 2: Вибір дати
import { useState, useEffect } from 'react'
import { apiGet } from '../api.js'
import { Skeleton, DAYS, MONTHS } from '../ui.jsx'

export default function DateScreen({ service, onSelect }) {
  const [dates,   setDates]   = useState([])
  const [loading, setLoading] = useState(true)
  const [picked,  setPicked]  = useState(null)

  useEffect(() => {
    const today = new Date()
    // Завантажуємо 30 днів паралельно (по 5 батчів)
    const all = Array.from({ length: 30 }, (_, i) => {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      return d.toISOString().substring(0, 10)
    })

    const batches = []
    for (let i = 0; i < all.length; i += 5) batches.push(all.slice(i, i + 5))

    const results = []
    ;(async () => {
      for (const batch of batches) {
        const settled = await Promise.allSettled(
          batch.map(dateStr =>
            apiGet('slots', { date: dateStr, service_id: service?.id || '' })
              .then(data => ({
                dateStr,
                freeCount: data.slots.filter(s => s.available).length,
              }))
              .catch(() => ({ dateStr, freeCount: 0 }))
          )
        )
        settled.forEach(r => r.status === 'fulfilled' && results.push(r.value))
        setDates(results.map(r => r))  // оновлюємо поступово
      }
      setLoading(false)
    })()
  }, [service])

  function pick(dateStr, freeCount) {
    if (freeCount === 0) return
    setPicked(dateStr)
    setTimeout(() => onSelect(dateStr), 180)
  }

  return (
    <div style={{ padding: 20, animation: 'slideIn .22s ease' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Оберіть дату</h1>
        <p style={{ color: 'var(--hint)', fontSize: 14, marginTop: 4 }}>
          {service?.name} · {service?.duration_min} хв
        </p>
      </div>

      {/* Горизонтальний скрол дат */}
      <div style={{
        display: 'flex', gap: 8, overflowX: 'auto',
        paddingBottom: 4, marginBottom: 20,
      }}>
        {loading
          ? [1,2,3,4,5].map(i => <Skeleton key={i} h={82} w={64} mb={0} style={{ flexShrink: 0 }} />)
          : dates.map(({ dateStr, freeCount }) => (
              <DatePill key={dateStr}
                dateStr={dateStr}
                freeCount={freeCount}
                selected={picked === dateStr}
                onSelect={() => pick(dateStr, freeCount)} />
            ))
        }
      </div>

      {/* Легенда */}
      <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--hint)' }}>
        <span><b style={{ color: '#34c759' }}>●</b> число = вільних слотів</span>
        <span>— = немає місць</span>
      </div>
    </div>
  )
}

function DatePill({ dateStr, freeCount, selected, onSelect }) {
  const d   = new Date(dateStr + 'T12:00:00')
  const empty = freeCount === 0

  return (
    <div onClick={onSelect} style={{
      flexShrink: 0, width: 64,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '10px 0', borderRadius: 14, cursor: empty ? 'default' : 'pointer',
      background: selected ? 'var(--btn)' : 'var(--bg2)',
      border: `2px solid ${selected ? 'var(--btn)' : 'transparent'}`,
      opacity: empty ? 0.4 : 1,
      transition: 'all .15s',
      userSelect: 'none',
    }}>
      <span style={{ fontSize: 11, fontWeight: 600,
        color: selected ? 'var(--btn-text)' : 'var(--hint)',
        opacity: .8, marginBottom: 2 }}>
        {DAYS[d.getDay()]}
      </span>
      <span style={{ fontSize: 20, fontWeight: 800,
        color: selected ? 'var(--btn-text)' : 'var(--text)',
        lineHeight: 1 }}>
        {d.getDate()}
      </span>
      <span style={{ fontSize: 10,
        color: selected ? 'var(--btn-text)' : 'var(--hint)',
        opacity: .7, marginBottom: 2 }}>
        {MONTHS[d.getMonth()]}
      </span>
      <span style={{ fontSize: 12, fontWeight: 700,
        color: selected ? 'var(--btn-text)' : (empty ? 'var(--hint)' : '#34c759') }}>
        {empty ? '—' : freeCount}
      </span>
    </div>
  )
}
