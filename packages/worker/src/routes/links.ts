import { Hono } from 'hono'
import type { Env } from '../index'
import { parseJsonColumns, type ProfileRow, type LinkRow, type CreateLinkRequest, type CreateLinkResponse, type GetLinkResponse } from '../types/api'
import { hashPassword, verifyPassword } from '../services/password'
import { deleteLinkCascade } from '../services/cleanup'

const LINK_TTL_MS = 3 * 24 * 60 * 60 * 1000

export const linksRouter = new Hono<{ Bindings: Env }>()

linksRouter.post('/', async (c) => {
  try {
    const { profile_id, password } = await c.req.json<CreateLinkRequest>()
    if (!profile_id) return c.json({ error: 'profile_id is required' }, 400)

    const profile = await c.env.DB.prepare('SELECT profile_id FROM profiles WHERE profile_id = ?')
      .bind(profile_id)
      .first()
    if (!profile) return c.json({ error: 'Profile not found' }, 404)

    const linkId = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + LINK_TTL_MS).toISOString()

    let passwordHash: string | null = null
    let passwordSalt: string | null = null
    if (password) {
      const hashed = await hashPassword(password)
      passwordHash = hashed.hash
      passwordSalt = hashed.salt
    }

    await c.env.DB.prepare(
      'INSERT INTO links (link_id, profile_id, expires_at, password_hash, password_salt) VALUES (?, ?, ?, ?, ?)'
    )
      .bind(linkId, profile_id, expiresAt, passwordHash, passwordSalt)
      .run()

    return c.json<CreateLinkResponse>({ link_id: linkId, expires_at: expiresAt }, 201)
  } catch (e) {
    console.error(e)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
})

linksRouter.get('/:linkId', async (c) => {
  try {
    const linkId = c.req.param('linkId')
    const link = await c.env.DB.prepare('SELECT * FROM links WHERE link_id = ?')
      .bind(linkId)
      .first<LinkRow>()

    if (!link) return c.json({ error: 'Link not found' }, 404)

    if (new Date(link.expires_at) < new Date()) {
      await deleteLinkCascade(c.env.DB, link.link_id)
      return c.json({ error: 'gone' }, 410)
    }

    const profile = await c.env.DB.prepare('SELECT * FROM profiles WHERE profile_id = ?')
      .bind(link.profile_id)
      .first<ProfileRow>()

    if (!profile) return c.json({ error: 'Associated profile not found' }, 404)

    return c.json<GetLinkResponse>({
      link_id: link.link_id,
      profile_id: link.profile_id,
      expires_at: link.expires_at,
      profile: parseJsonColumns(profile),
    })
  } catch (e) {
    console.error(e)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
})

linksRouter.delete('/:linkId', async (c) => {
  try {
    const linkId = c.req.param('linkId')
    const { password } = await c.req.json<{ password?: string }>()

    const link = await c.env.DB.prepare('SELECT * FROM links WHERE link_id = ?')
      .bind(linkId)
      .first<LinkRow>()

    if (!link) return c.json({ error: 'Link not found' }, 404)

    if (!link.password_hash || !link.password_salt) {
      return c.json({ error: 'password_not_set' }, 409)
    }

    if (!password || !(await verifyPassword(password, link.password_hash, link.password_salt))) {
      return c.json({ error: 'invalid_password' }, 403)
    }

    await deleteLinkCascade(c.env.DB, linkId)
    return c.body(null, 204)
  } catch (e) {
    console.error(e)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
})
