// BookFlow Client — Спільні UI-компоненти
import { useEffect } from 'react'

/* ── Skeleton ─────────────────────────────────────────────── */
export function Skeleton({ h = 48, w = '100%', mb = 10 }) {
  return (
    <div className="skeleton"
      style={{ height: h, width: w, marginBottom: mb }} />
  )
}

/* ── Toast ────────────────────────────────────────────────── */
export function Toast({ message, onHide }) {
  useEffect(() => {
    const t = setTimeout(onHide, 2600)
    return () => clearTimeout(t)
  }, [onHide])

  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%',
      transform: 'translateX(-50%)',
      background: '#222', color: '#fff',
      padding: '10px 20px', borderRadius: 24,
      fontSize: 14, zIndex: 999,
      animation: 'fadeUp .2s ease',
      whiteSpace: 'nowrap', maxWidth: '90vw',
      boxShadow: '0 4px 20px rgba(0,0,0,.3)',
    }}>
      {message}
    </div>
  )
}

/* ── StatusBadge ──────────────────────────────────────────── */
const STATUS_MAP = {
  pending:   ['🕐 Очікується', '#ff9500'],
  confirmed: ['✅ Підтверджено', '#34c759'],
  arrived:   ['🟢 Прийшов',    '#34c759'],
  no_show:   ['🔴 Не прийшов', '#ff3b30'],
  cancelled: ['❌ Скасовано',   '#ff3b30'],
}
export function StatusBadge({ status }) {
  const [label, color] = STATUS_MAP[status] || [status, '#999']
  return (
    <span style={{
      fontSize: 11, fontWeight: 600,
      padding: '3px 9px', borderRadius: 20,
      background: color + '22', color,
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  )
}

/* ── Button ───────────────────────────────────────────────── */
export function Btn({ children, onClick, disabled, variant = 'primary', style = {} }) {
  const styles = {
    primary:   { background: 'var(--btn)',  color: 'var(--btn-text)' },
    secondary: { background: 'var(--bg2)', color: 'var(--text)' },
    danger:    { background: '#ff3b3020',  color: '#ff3b30' },
    ghost:     { background: 'transparent', color: 'var(--btn)',
                 border: '1.5px solid var(--btn)' },
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 8, width: '100%', padding: '13px 20px',
        border: 'none', borderRadius: 'var(--r)',
        fontSize: 16, fontWeight: 600,
        transition: 'opacity .15s, transform .1s',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        ...styles[variant],
        ...style,
      }}
      onPointerDown={e => !disabled && (e.currentTarget.style.transform = 'scale(.98)')}
      onPointerUp={e => (e.currentTarget.style.transform = '')}
      onPointerLeave={e => (e.currentTarget.style.transform = '')}
    >
      {children}
    </button>
  )
}

/* ── Input ────────────────────────────────────────────────── */
export function Input({ label, ...props }) {
  return (
    <div style={{ marginBottom: 10 }}>
      {label && (
        <div style={{ fontSize: 13, color: 'var(--hint)', marginBottom: 4 }}>
          {label}
        </div>
      )}
      <input
        {...props}
        style={{
          width: '100%', padding: '12px 14px',
          border: '1.5px solid var(--bg2)',
          borderRadius: 'var(--r-sm)',
          background: 'var(--bg2)', color: 'var(--text)',
          fontSize: 16, outline: 'none',
          transition: 'border-color .15s',
          ...props.style,
        }}
        onFocus={e => (e.target.style.borderColor = 'var(--btn)')}
        onBlur={e  => (e.target.style.borderColor = 'var(--bg2)')}
      />
    </div>
  )
}

/* ── Modal (bottom sheet) ─────────────────────────────────── */
export function Modal({ title, children, onClose }) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,.5)',
        display: 'flex', alignItems: 'flex-end',
        zIndex: 800,
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', background: 'var(--bg)',
          borderRadius: '18px 18px 0 0',
          padding: '20px 20px 40px',
          maxHeight: '90vh', overflowY: 'auto',
          animation: 'slideUp .25s ease',
        }}
      >
        {title && (
          <h3 style={{
            textAlign: 'center', fontSize: 18,
            fontWeight: 700, marginBottom: 18,
          }}>
            {title}
          </h3>
        )}
        {children}
      </div>
    </div>
  )
}

/* ── SectionTitle ─────────────────────────────────────────── */
export function SectionTitle({ children, style = {} }) {
  return (
    <div style={{
      fontSize: 12, fontWeight: 700,
      color: 'var(--hint)',
      textTransform: 'uppercase',
      letterSpacing: '.6px',
      marginBottom: 8,
      ...style,
    }}>
      {children}
    </div>
  )
}

/* ── formatDatetime ───────────────────────────────────────── */
const DAYS   = ['Нд','Пн','Вт','Ср','Чт','Пт','Сб']
const MONTHS = ['січ','лют','бер','кві','тра','чер','лип','сер','вер','жов','лис','гру']
const MONTHS_FULL = ['січня','лютого','березня','квітня','травня','червня',
                     'липня','серпня','вересня','жовтня','листопада','грудня']

export function fmtDT(dt) {
  const d  = new Date(dt)
  const hh = d.getHours().toString().padStart(2,'0')
  const mm = d.getMinutes().toString().padStart(2,'0')
  return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} о ${hh}:${mm}`
}

export function fmtDateFull(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS_FULL[d.getMonth()]}`
}

export { DAYS, MONTHS, MONTHS_FULL }
