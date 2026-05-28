// Екран 1: Вибір послуги
import { useState, useEffect } from 'react'
import { apiGet } from '../api.js'
import { Skeleton, SectionTitle } from '../ui.jsx'

export default function ServicesScreen({ onSelect }) {
  const [services, setServices] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [picked,   setPicked]   = useState(null)

  useEffect(() => {
    apiGet('services')
      .then(setServices)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function choose(s) {
    setPicked(s.id)
    setTimeout(() => onSelect(s), 180)
  }

  return (
    <div style={{ padding: 20, animation: 'slideIn .22s ease' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Оберіть послугу</h1>
        <p style={{ color: 'var(--hint)', fontSize: 14, marginTop: 4 }}>
          Що вас цікавить?
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[1,2,3,4].map(i => <Skeleton key={i} h={120} />)}
        </div>
      ) : services.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--hint)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🛠</div>
          <p>Послуг ще не додано</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {services.map(s => (
            <ServiceCard key={s.id} svc={s}
              selected={picked === s.id}
              onSelect={() => choose(s)} />
          ))}
        </div>
      )}
    </div>
  )
}

function ServiceCard({ svc, selected, onSelect }) {
  return (
    <div onClick={onSelect} style={{
      background: 'var(--bg2)',
      borderRadius: 14,
      padding: 16,
      cursor: 'pointer',
      border: `2px solid ${selected ? 'var(--btn)' : 'transparent'}`,
      transition: 'all .15s',
      transform: selected ? 'scale(.97)' : 'scale(1)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <span style={{
          width: 10, height: 10, borderRadius: '50%',
          background: svc.color || '#2481cc',
          flexShrink: 0, display: 'inline-block',
        }} />
        <span style={{ fontSize: 12, color: 'var(--hint)' }}>
          {svc.duration_min} хв
        </span>
      </div>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6, lineHeight: 1.3 }}>
        {svc.name}
      </div>
      <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--btn)' }}>
        {svc.price > 0 ? `${svc.price} грн` : 'Безкоштовно'}
      </div>
    </div>
  )
}
