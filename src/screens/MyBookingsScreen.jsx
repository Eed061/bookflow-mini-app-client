// Екран 5: Мої записи + скасування
import { useState, useEffect, useCallback } from 'react'
import { apiGet, apiPost } from '../api.js'
import { Skeleton, StatusBadge, Modal, Btn, Toast, SectionTitle, fmtDT } from '../ui.jsx'

export default function MyBookingsScreen({ telegramId, go }) {
  const [data,    setData]    = useState({ upcoming: [], past: [] })
  const [loading, setLoading] = useState(true)
  const [modal,   setModal]   = useState(null)   // booking або {booking, warning}
  const [toast,   setToast]   = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    apiGet('bookings', { telegram_id: telegramId })
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [telegramId])

  useEffect(() => { load() }, [load])

  async function doCancel(booking, force = false) {
    try {
      const res = await apiPost('bookings/cancel', {
        id: booking.id, telegram_id: telegramId, force,
      })
      if (res.warning) {
        setModal({ booking, warning: res.message })
        return
      }
      setModal(null)
      setToast('✅ Запис скасовано')
      load()
    } catch (e) {
      setToast('⚠️ ' + e.message)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>Мої записи</div>
        {[1,2,3].map(i => <Skeleton key={i} h={90} />)}
      </div>
    )
  }

  const { upcoming, past } = data

  return (
    <div style={{ padding: 20, paddingBottom: 40, animation: 'slideIn .22s ease' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Мої записи</h1>
      </div>

      {upcoming.length === 0 && past.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--hint)' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>📋</div>
          <h3 style={{ fontSize: 18, color: 'var(--text)', marginBottom: 8 }}>
            Записів ще немає
          </h3>
          <p style={{ fontSize: 14, lineHeight: 1.5, marginBottom: 24 }}>
            Запишіться на зручний для вас час!
          </p>
          <Btn onClick={() => go('services')}>📅 Записатись</Btn>
        </div>
      ) : (
        <>
          {/* Майбутні */}
          {upcoming.length > 0 && (
            <>
              <SectionTitle>Майбутні</SectionTitle>
              {upcoming.map(b => (
                <BookingCard key={b.id} booking={b}
                  onCancel={() => setModal({ booking: b })} />
              ))}
            </>
          )}

          {/* Минулі */}
          {past.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <SectionTitle>Минулі</SectionTitle>
              {past.slice(0, 8).map(b => (
                <BookingCard key={b.id} booking={b} isPast />
              ))}
            </div>
          )}
        </>
      )}

      {/* Модаль скасування */}
      {modal && (
        <Modal
          title={modal.warning ? '⚠️ Пізнє скасування' : '❓ Скасувати запис?'}
          onClose={() => setModal(null)}
        >
          <p style={{ textAlign: 'center', color: 'var(--hint)',
            marginBottom: 20, lineHeight: 1.6, fontSize: 15 }}>
            {modal.warning
              ? modal.warning
              : `${modal.booking.service_name}\n${fmtDT(modal.booking.datetime)}`
            }
          </p>
          <Btn variant="danger" style={{ marginBottom: 10 }}
            onClick={() => doCancel(modal.booking, !!modal.warning)}>
            {modal.warning ? 'Все одно скасувати' : '❌ Скасувати запис'}
          </Btn>
          <Btn variant="secondary" onClick={() => setModal(null)}>
            🔙 Залишити
          </Btn>
        </Modal>
      )}

      {toast && <Toast message={toast} onHide={() => setToast(null)} />}
    </div>
  )
}

function BookingCard({ booking: b, onCancel, isPast }) {
  return (
    <div style={{
      background: 'var(--bg2)', borderRadius: 14,
      padding: 16, marginBottom: 10,
      opacity: isPast ? .7 : 1,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', marginBottom: 6 }}>
        <span style={{ fontWeight: 700, fontSize: 16 }}>{b.service_name}</span>
        <StatusBadge status={b.status} />
      </div>
      <div style={{ color: 'var(--hint)', fontSize: 14, marginBottom: onCancel ? 12 : 0 }}>
        📅 {fmtDT(b.datetime)}
      </div>
      {onCancel && b.status !== 'cancelled' && (
        <button onClick={onCancel} style={{
          background: 'none', border: '1.5px solid var(--hint)',
          borderRadius: 8, padding: '7px 14px',
          fontSize: 13, color: 'var(--hint)', cursor: 'pointer',
          fontFamily: 'var(--font)',
        }}>
          Скасувати
        </button>
      )}
    </div>
  )
}
