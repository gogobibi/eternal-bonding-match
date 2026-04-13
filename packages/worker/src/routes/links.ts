import { Hono } from 'hono'
import type { Env } from '../index'
import { parseJsonColumns, type ProfileRow, type LinkRow, type CreateLinkRequest } from '../types/api'

const links = new Hono<{ Bindings: Env }>()

links.post('/', async (c) => {
  try {
    const { profile_id } = await c.req.json<CreateLinkRequest>()
    if (!profile_id) return c.json({ error: 'profile_id is required' }, 400)

    const profile = await c.env.DB.prepare('SELECT profile_id FROM profiles WHERE profile_id = ?')
      .bind(profile_id)
      .first()
    if (!profile) return c.json({ error: 'Profile not found' }, 404)

    const linkId = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

    await c.env.DB.prepare('INSERT INTO links (link_id, profile_id, expires_at) VALUES (?, ?, ?)')
      .bind(linkId, profile_id, expiresAt)
      .run()

    return c.json({ link_id: linkId, expires_at: expiresAt }, 201)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return c.json({ error: message }, 500)
  }
})

links.get('/:linkId', async (c) => {
  try {
    const linkId = c.req.param('linkId')
    const link = await c.env.DB.prepare('SELECT * FROM links WHERE link_id = ?')
      .bind(linkId)
      .first<LinkRow>()

    if (!link) return c.json({ error: 'Link not found' }, 404)

    if (new Date(link.expires_at) < new Date()) {
      return c.json({ error: 'Link has expired' }, 410)
    }

    const profile = await c.env.DB.prepare('SELECT * FROM profiles WHERE profile_id = ?')
      .bind(link.profile_id)
      .first<ProfileRow>()

    if (!profile) return c.json({ error: 'Associated profile not found' }, 404)

    return c.json({
      link_id: link.link_id,
      profile_id: link.profile_id,
      expires_at: link.expires_at,
      profile: parseJsonColumns(profile),
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return c.json({ error: message }, 500)
  }
})

export default links
