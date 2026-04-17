const PBKDF2_ITERATIONS = 100_000
const SALT_BYTES = 16
const KEY_BITS = 256

function bytesToBase64(bytes: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  return btoa(binary)
}

function base64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

async function derive(password: string, salt: Uint8Array): Promise<Uint8Array> {
  const pwBytes = new TextEncoder().encode(password)
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    pwBytes as BufferSource,
    { name: 'PBKDF2' },
    false,
    ['deriveBits'],
  )
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: salt as BufferSource, iterations: PBKDF2_ITERATIONS },
    keyMaterial,
    KEY_BITS,
  )
  return new Uint8Array(bits)
}

export async function hashPassword(pw: string): Promise<{ hash: string; salt: string }> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES))
  const derived = await derive(pw, salt)
  return { hash: bytesToBase64(derived), salt: bytesToBase64(salt) }
}

export async function verifyPassword(pw: string, hash: string, salt: string): Promise<boolean> {
  const saltBytes = base64ToBytes(salt)
  const expected = base64ToBytes(hash)
  const derived = await derive(pw, saltBytes)
  if (derived.length !== expected.length) return false
  // constant-time compare
  let diff = 0
  for (let i = 0; i < derived.length; i++) diff |= derived[i] ^ expected[i]
  return diff === 0
}
