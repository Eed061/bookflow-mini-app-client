// BookFlow Client — App.jsx (з підтримкою спеціалістів)
import { useState, useEffect, useCallback } from 'react'
import HomeScreen         from './screens/HomeScreen.jsx'
import SpecialistScreen   from './screens/SpecialistScreen.jsx'
import ServicesScreen     from './screens/ServicesScreen.jsx'
import DateScreen         from './screens/DateScreen.jsx'
import TimeScreen         from './screens/TimeScreen.jsx'
import ConfirmScreen      from './screens/ConfirmScreen.jsx'
import MyBookingsScreen   from './screens/MyBookingsScreen.jsx'

const tg = window.Telegram?.WebApp

export default function App() {
  const [screen,  setScreen]  = useState('home')
  const [history, setHistory] = useState([])
  const [booking, setBooking] = useState({
    specialist: null,
    service: null, date: null, time: null, name: '', phone: '',
  })

  const telegramId =
    tg?.initDataUnsafe?.user?.id ||
    new URLSearchParams(window.location.search).get('tg_id') ||
    'dev_user'

  useEffect(() => {
    if (!tg) return
    tg.ready(); tg.expand()
    const tp = tg.themeParams || {}
    const r  = document.documentElement
    const m  = {
      '--bg': tp.bg_color, '--bg2': tp.secondary_bg_color,
      '--text': tp.text_color, '--hint': tp.hint_color,
      '--link': tp.link_color, '--btn': tp.button_color,
      '--btn-text': tp.button_text_color,
      '--destructive': tp.destructive_text_color,
    }
    Object.entries(m).forEach(([k,v]) => v && r.style.setProperty(k, v))
  }, [])

  const go = useCallback((to) => {
    setHistory(h => [...h, screen])
    setScreen(to)
    if (tg?.BackButton) { tg.BackButton.show(); tg.BackButton.onClick(goBack) }
  }, [screen]) // eslint-disable-line

  const goBack = useCallback(() => {
    setHistory(h => {
      const prev = h[h.length - 1] || 'home'
      setScreen(prev)
      const next = h.slice(0, -1)
      if (next.length === 0 && tg?.BackButton) tg.BackButton.hide()
      return next
    })
  }, [])

  const reset = useCallback(() => {
    setBooking({ specialist: null, service: null, date: null, time: null, name: '', phone: '' })
    setHistory([]); setScreen('home')
    if (tg?.BackButton) tg.BackButton.hide()
  }, [])

  const patch = d => setBooking(b => ({ ...b, ...d }))
  const sh = { telegramId, go, goBack, reset }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh' }}>
      {screen === 'home' && (
        <HomeScreen {...sh}
          onBook={() => go('specialist')}
          onMyBookings={() => go('mybookings')}
        />
      )}

      {/* Новий екран — вибір спеціаліста */}
      {screen === 'specialist' && (
        <SpecialistScreen
          {...sh}
          onSelect={s => { patch({ specialist: s }); go('services') }}
          onSkip={() => { patch({ specialist: null }); go('services') }}
        />
      )}

      {screen === 'services' && (
        <ServicesScreen
          {...sh}
          specialist={booking.specialist}
          onSelect={s => { patch({ service: s }); go('date') }}
        />
      )}

      {screen === 'date' && (
        <DateScreen
          {...sh}
          service={booking.service}
          specialist={booking.specialist}
          onSelect={d => { patch({ date: d }); go('time') }}
        />
      )}

      {screen === 'time' && (
        <TimeScreen
          {...sh}
          service={booking.service}
          specialist={booking.specialist}
          date={booking.date}
          onSelect={t => { patch({ time: t }); go('confirm') }}
        />
      )}

      {screen === 'confirm' && (
        <ConfirmScreen
          {...sh}
          booking={booking}
          onChangeName={n => patch({ name: n })}
          onChangePhone={p => patch({ phone: p })}
          onSuccess={reset}
        />
      )}

      {screen === 'mybookings' && <MyBookingsScreen {...sh} />}
    </div>
  )
}
