import { Hono } from 'hono'
import type { Env } from '../index'
import type { CreateMatchRequest, CreateMatchResponse, GetMatchResponse } from '../types/api'

export const matchRouter = new Hono<{ Bindings: Env }>()

async function resolveLink(db: D1Database, linkId: string) {
  const link = await db.prepare(
    'SELECT * FROM links WHERE link_id = ?'
  ).bind(linkId).first<{ link_id: string; profile_id: string; expires_at: string }>()

  if (!link) return { error: 'Link not found' as const, status: 404 as const }
  if (new Date(link.expires_at) < new Date()) return { error: 'Link expired' as const, status: 410 as const }
  return { profile_id: link.profile_id }
}

matchRouter.post('/', async (c) => {
  try {
    const { link_id_a, link_id_b } = await c.req.json<CreateMatchRequest>()

    const resultA = await resolveLink(c.env.DB, link_id_a)
    if ('error' in resultA) return c.json({ error: resultA.error }, resultA.status)

    const resultB = await resolveLink(c.env.DB, link_id_b)
    if ('error' in resultB) return c.json({ error: resultB.error }, resultB.status)

    if (resultA.profile_id === resultB.profile_id) {
      return c.json({ error: 'Cannot match same profile' }, 400)
    }

    let profile_a_id = resultA.profile_id
    let profile_b_id = resultB.profile_id
    if (profile_a_id > profile_b_id) {
      ;[profile_a_id, profile_b_id] = [profile_b_id, profile_a_id]
    }

    const existing = await c.env.DB.prepare(
      'SELECT match_id FROM matches WHERE profile_a_id = ? AND profile_b_id = ?'
    ).bind(profile_a_id, profile_b_id).first<{ match_id: string }>()

    if (existing) {
      return c.json<CreateMatchResponse>({ match_id: existing.match_id }, 200)
    }

    const match_id = crypto.randomUUID()

    await c.env.DB.prepare(
      'INSERT INTO matches (match_id, profile_a_id, profile_b_id, score, analysis, comment) VALUES (?, ?, ?, 0, ?, ?)'
    ).bind(match_id, profile_a_id, profile_b_id, 'pending', 'pending').run()

    return c.json<CreateMatchResponse>({ match_id }, 201)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return c.json({ error: message }, 500)
  }
})

matchRouter.get('/:matchId', async (c) => {
  try {
    const matchId = c.req.param('matchId')

    const match = await c.env.DB.prepare(
      'SELECT * FROM matches WHERE match_id = ?'
    ).bind(matchId).first<{ match_id: string; score: number; analysis: string; comment: string; created_at: string }>()

    if (!match) {
      return c.json({ error: 'Match not found' }, 404)
    }

    return c.json<GetMatchResponse>({
      match_id: match.match_id,
      score: match.score,
      analysis: match.analysis,
      comment: match.comment,
      created_at: match.created_at,
    }, 200)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return c.json({ error: message }, 500)
  }
})
