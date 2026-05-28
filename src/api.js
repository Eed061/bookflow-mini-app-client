// BookFlow Client — API helper
const BASE = import.meta.env.VITE_API_URL

export async function apiGet(path, params = {}) {
  const url = new URL(BASE)
  url.searchParams.set('path', path)
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v))
  })
  const res  = await fetch(url.toString())
  const json = await res.json()
  if (!json.ok) throw new Error(json.error || 'API помилка')
  return json.data
}

export async function apiPost(path, body = {}) {
  const url = new URL(BASE)
  url.searchParams.set('path', path)
  const res = await fetch(url.toString(), {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  })
  const json = await res.json()
  if (!json.ok) throw new Error(json.error || 'API помилка')
  return json.data
}
