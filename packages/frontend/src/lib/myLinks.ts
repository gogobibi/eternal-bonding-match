const STORAGE_KEY = 'ebm:my-links'

export interface MyLinkEntry {
  link_id: string
  profile_id: string
  nickname: string
  created_at: string
  expires_at: string
  has_password: boolean
}

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function isValidEntry(value: unknown): value is MyLinkEntry {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  return (
    typeof v.link_id === 'string' &&
    typeof v.profile_id === 'string' &&
    typeof v.nickname === 'string' &&
    typeof v.created_at === 'string' &&
    typeof v.expires_at === 'string' &&
    typeof v.has_password === 'boolean'
  )
}

function readAll(): MyLinkEntry[] {
  if (!isBrowser()) return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isValidEntry)
  } catch {
    return []
  }
}

function writeAll(entries: MyLinkEntry[]): void {
  if (!isBrowser()) return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch {
    // ignore quota / access errors
  }
}

export function listMyLinks(): MyLinkEntry[] {
  return readAll()
}

export function saveMyLink(entry: MyLinkEntry): void {
  if (!isValidEntry(entry)) return
  const current = readAll()
  const deduped = current.filter(e => e.link_id !== entry.link_id)
  deduped.push(entry)
  writeAll(deduped)
}

export function removeMyLink(linkId: string): void {
  const current = readAll()
  writeAll(current.filter(e => e.link_id !== linkId))
}

export function pruneExpired(): MyLinkEntry[] {
  const now = Date.now()
  const current = readAll()
  const survivors = current.filter(e => {
    const t = Date.parse(e.expires_at)
    if (Number.isNaN(t)) return false
    return t > now
  })
  if (survivors.length !== current.length) {
    writeAll(survivors)
  }
  return survivors
}
