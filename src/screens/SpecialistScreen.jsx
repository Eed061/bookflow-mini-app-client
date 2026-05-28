// Екран вибору спеціаліста
import { useState, useEffect } from 'react'
import { apiGet } from '../api.js'
import { Skeleton } from '../ui.jsx'

export default function SpecialistScreen({ onSelect, onSkip }) {
  const [specialists, setSpecialists] = useState([])
  const [loading, setLoading]         = useState(true)
  const [picked, setPicked]           = useState(null)

  useEffect(() => {
    apiGet('specialists')
      .then(data => {
        // Якщо спеціалістів немає — пропускаємо крок
        if (!data || data.length === 0) { onSkip(); return; }
        setSpecialists(data)
      })
      .catch(() => onSkip())
      .finally(() => setLoading(false))
  }, [])

  function choose(s) {
    setPicked(s.id)
    setTimeout(() => onSelect(s), 180)
  }

  if (loading) return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ height: 28, background: 'var(--bg2)', borderRadius: 8,
          width: 180, marginBottom: 8 }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[1,2,3].map(i => <Skeleton key={i} h={88} />)}
      </div>
    </div>
  )

  return (
    <div style={{ padding: 20, animation: 'slideIn .22s ease' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Оберіть майстра</h1>
        <p style={{ color: 'var(--hint)', fontSize: 14, marginTop: 4 }}>
          До кого хочете записатись?
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {specialists.map(s => (
          <SpecialistCard
            key={s.id}
            specialist={s}
            selected={picked === s.id}
            onSelect={() => choose(s)}
          />
        ))}
      </div>
    </div>
  )
}

function SpecialistCard({ specialist: s, selected, onSelect }) {
  return (
    <div onClick={onSelect} style={{
      background: 'var(--bg2)',
      borderRadius: 16,
      padding: '14px 16px',
      cursor: 'pointer',
      border: `2px solid ${selected ? 'var(--btn)' : 'transparent'}`,
      transition: 'all .15s',
      transform: selected ? 'scale(.98)' : 'scale(1)',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
    }}>
      {/* Аватар */}
      <div style={{
        width: 56, height: 56, borderRadius: '50%',
        background: 'var(--btn)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 24, flexShrink: 0,
        overflow: 'hidden',
      }}>
        {s.photo_url
          ? <img src={s.photo_url} alt={s.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : '👤'
        }
      </div>

      {/* Інфо */}
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 16 }}>{s.name}</div>
        {s.bio && (
          <div style={{ color: 'var(--hint)', fontSize: 13, marginTop: 3,
            lineHeight: 1.4, display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {s.bio}
          </div>
        )}
      </div>

      {/* Стрілка */}
      <div style={{ color: 'var(--hint)', fontSize: 18 }}>›</div>
    </div>
  )
}
