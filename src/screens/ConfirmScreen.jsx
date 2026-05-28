// Екран 4: Підтвердження та запис
import { useState } from 'react'
import { apiPost } from '../api.js'
import { Btn, Input, Toast, fmtDateFull } from '../ui.jsx'

export default function ConfirmScreen({
  booking, telegramId,
  onChangeName, onChangePhone,
  onSuccess,
}) {
  const { service, date, time, name, phone } = booking
  const [comment,  setComment]  = useState('')
  const [loading,  setLoading]  = useState(false)
  const [toast,    setToast]    = useState(null)
  const [done,     setDone]     = useState(false)

  async function handleConfirm() {
    if (!name.trim()) { setToast("Введіть ваше ім'я"); return }
    setLoading(true)
    try {
      await apiPost('bookings/create', {
        telegram_id: telegramId,
        service_id:  service.id,
        datetime:    `${date}T${time}:00`,
        name, phone, notes: comment,
      })
      setDone(true)
      launchConfetti()
    } catch (err) {
      setToast(err.message || 'Помилка. Спробуйте ще раз.')
    } finally {
      setLoading(false)
    }
  }

  function addToCalendar() {
    const dtStart = `${date.replace(/-/g,'')}T${time.replace(':','')}00`
    const end = new Date(`${date}T${time}:00`)
    end.setMinutes(end.getMinutes() + (service?.duration_min || 60))
    const dtEnd = end.toISOString().replace(/[-:.]/g,'').substring(0,15)
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE`
              + `&text=${encodeURIComponent(service?.name || 'Запис')}`
              + `&dates=${dtStart}/${dtEnd}`
    window.open(url, '_blank')
  }

  // ── Екран успіху ──────────────────────────────────────────
  if (done) {
    return (
      <div style={{ padding: 24, textAlign: 'center',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', animation: 'fadeUp .3s ease' }}>

        <div style={{ fontSize: 80, marginBottom: 16, lineHeight: 1 }}>🎉</div>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
          Запис підтверджено!
        </h2>
        <p style={{ color: 'var(--hint)', fontSize: 15, lineHeight: 1.7, marginBottom: 8 }}>
          <b style={{ color: 'var(--text)' }}>{service?.name}</b><br />
          {fmtDateFull(date)} о {time}
        </p>
        <p style={{ fontSize: 13, color: 'var(--hint)', marginBottom: 32 }}>
          🔔 Нагадування прийде в бот перед візитом
        </p>

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Btn onClick={addToCalendar} variant="secondary">
            📆 Додати в Google Calendar
          </Btn>
          <Btn onClick={onSuccess}>
            🏠 На головну
          </Btn>
        </div>
      </div>
    )
  }

  // ── Форма підтвердження ───────────────────────────────────
  return (
    <div style={{ padding: 20, paddingBottom: 40, animation: 'slideIn .22s ease' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Підтвердження</h1>
        <p style={{ color: 'var(--hint)', fontSize: 14, marginTop: 4 }}>
          Перевірте деталі запису
        </p>
      </div>

      {/* Резюме */}
      <div style={{ background: 'var(--bg2)', borderRadius: 14, padding: '4px 16px', marginBottom: 20 }}>
        {[
          ['Послуга',   service?.name],
          ['Дата',      fmtDateFull(date)],
          ['Час',       time],
          ['Тривалість', `${service?.duration_min} хв`],
          ['Вартість',  service?.price > 0 ? `${service.price} грн` : 'Безкоштовно'],
        ].map(([label, value]) => (
          <div key={label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '13px 0',
            borderBottom: '1px solid var(--bg)',
          }}>
            <span style={{ color: 'var(--hint)', fontSize: 14 }}>{label}</span>
            <span style={{ fontWeight: 700, fontSize: 15,
              color: label === 'Вартість' ? 'var(--btn)' : 'var(--text)' }}>
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Дані клієнта */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--hint)',
          textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: 10 }}>
          Ваші дані
        </div>
        <Input
          label="Ім'я *"
          placeholder="Як до вас звертатись?"
          value={name}
          onChange={e => onChangeName(e.target.value)}
        />
        <Input
          label="Телефон"
          placeholder="+380..."
          type="tel"
          value={phone}
          onChange={e => onChangePhone(e.target.value)}
        />
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 13, color: 'var(--hint)', marginBottom: 4 }}>
            Коментар
          </div>
          <textarea
            placeholder="Щось важливе для майстра..."
            value={comment}
            onChange={e => setComment(e.target.value)}
            rows={2}
            style={{
              width: '100%', padding: '12px 14px',
              border: '1.5px solid var(--bg2)',
              borderRadius: 8, background: 'var(--bg2)',
              color: 'var(--text)', fontSize: 15,
              outline: 'none', resize: 'none',
              fontFamily: 'var(--font)',
            }}
          />
        </div>
      </div>

      <Btn onClick={handleConfirm} disabled={loading} style={{ fontSize: 17, padding: 16 }}>
        {loading ? '⏳ Зберігаємо...' : '✅ Підтвердити запис'}
      </Btn>

      {toast && <Toast message={toast} onHide={() => setToast(null)} />}
    </div>
  )
}

// Простий canvas-confetti
function launchConfetti() {
  const canvas = Object.assign(document.createElement('canvas'), {
    style: 'position:fixed;inset:0;pointer-events:none;z-index:9999',
  })
  canvas.width  = window.innerWidth
  canvas.height = window.innerHeight
  document.body.appendChild(canvas)
  const ctx = canvas.getContext('2d')
  const COLORS = ['#ff3b30','#34c759','#007aff','#ff9500','#af52de','#00c7be']
  const particles = Array.from({ length: 90 }, () => ({
    x:    Math.random() * canvas.width,
    y:    -10 - Math.random() * 60,
    vx:   (Math.random() - .5) * 7,
    vy:   Math.random() * 3 + 2,
    rot:  Math.random() * 360,
    size: Math.random() * 8 + 4,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  }))
  let frame = 0
  ;(function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    particles.forEach(p => {
      ctx.save()
      ctx.fillStyle = p.color
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot * Math.PI / 180)
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * .5)
      ctx.restore()
      p.x += p.vx; p.y += p.vy; p.rot += 4; p.vy += .07
    })
    if (++frame < 130) requestAnimationFrame(draw)
    else canvas.remove()
  })()
}
