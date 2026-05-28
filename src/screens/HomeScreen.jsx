// Екран 0: Головний
import { useState, useEffect } from 'react'
import { apiGet } from '../api.js'
import { Btn } from '../ui.jsx'

export default function HomeScreen({ onBook, onMyBookings }) {
  const [name, setName] = useState('BookFlow')

  useEffect(() => {
    apiGet('settings').then(s => setName(s.business_name || 'BookFlow')).catch(() => {})
  }, [])

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column',
      minHeight: '100vh', animation: 'fadeUp .25s ease' }}>

      {/* Hero */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        paddingBottom: 40 }}>
        <div style={{ fontSize: 72, marginBottom: 20, lineHeight: 1 }}>📅</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 10, lineHeight: 1.2 }}>
          {name}
        </h1>
        <p style={{ color: 'var(--hint)', fontSize: 16, lineHeight: 1.6, maxWidth: 280 }}>
          Запишіться онлайн — швидко,<br />зручно і без дзвінків
        </p>
      </div>

      {/* Кнопки */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Btn onClick={onBook} style={{ fontSize: 17, padding: 16 }}>
          📝 Записатись
        </Btn>
        <Btn onClick={onMyBookings} variant="secondary">
          📋 Мої записи
        </Btn>
      </div>
    </div>
  )
}
