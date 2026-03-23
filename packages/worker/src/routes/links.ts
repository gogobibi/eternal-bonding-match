import { Hono } from 'hono'
import type { Env } from '../index'
import type { CreateLinkRequest, CreateLinkResponse, GetLinkResponse, ProfileRow } from '../types/api'

const JSON_COLUMNS = [
  'me_age', 'me_weekday', 'me_weekend', 'you_age', 'you_weekday', 'you_weekend',
  'coupling_priority', 'me_race', 'you_race', 'my_jobs', 'my_selected', 'my_custom',
  'you_jobs', 'you_selected', 'you_custom', 'play_styles', 'extra_items',
] as const

export const linksRouter = new Hono<{ Bindings: Env }>()

linksRouter.post('/', async (c) => {
  try {
    const { profile_id } = await c.req.json<CreateLinkRequest>()

    const profile = await c.env.DB.prepare(
      'SELECT profile_id FROM profiles WHERE profile_id = ?'
    ).bind(profile_id).first()

    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404)
    }

    const link_id = crypto.randomUUID()
    const expires_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

    await c.env.DB.prepare(
      'INSERT INTO links (link_id, profile_id, expires_at) VALUES (?, ?, ?)'
    ).bind(link_id, profile_id, expires_at).run()

    return c.json<CreateLinkResponse>({ link_id, expires_at }, 201)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return c.json({ error: message }, 500)
  }
})

linksRouter.get('/:linkId', async (c) => {
  try {
    const linkId = c.req.param('linkId')

    const link = await c.env.DB.prepare(
      'SELECT * FROM links WHERE link_id = ?'
    ).bind(linkId).first<{ link_id: string; profile_id: string; expires_at: string }>()

    if (!link) {
      return c.json({ error: 'Link not found' }, 404)
    }

    if (new Date(link.expires_at) < new Date()) {
      return c.json({ error: 'Link expired' }, 410)
    }

    const profile = await c.env.DB.prepare(
      'SELECT * FROM profiles WHERE profile_id = ?'
    ).bind(link.profile_id).first<Record<string, unknown>>()

    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404)
    }

    for (const col of JSON_COLUMNS) {
      if (typeof profile[col] === 'string') {
        profile[col] = JSON.parse(profile[col] as string)
      }
    }

    return c.json<GetLinkResponse>({
      link_id: link.link_id,
      profile_id: link.profile_id,
      expires_at: link.expires_at,
      profile: profile as unknown as ProfileRow,
    }, 200)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return c.json({ error: message }, 500)
  }
})
