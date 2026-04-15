import { Hono } from 'hono'
import type { Env } from '../index'
import type { LinkRow, CreateMatchRequest, CreateMatchResponse, GetMatchResponse, MatchRow } from '../types/api'

export const matchRouter = new Hono<{ Bindings: Env }>()

async function resolveLink(db: D1Database, linkId: string) {
  const link = await db.prepare('SELECT * FROM links WHERE link_id = ?')
    .bind(linkId).first<LinkRow>()

  if (!link) return { error: 'Link not found' as const, status: 404 as const }
  if (new Date(link.expires_at) < new Date()) return { error: 'Link expired' as const, status: 410 as const }
  return { profile_id: link.profile_id }
}

matchRouter.post('/', async (c) => {
  try {
    const { link_id_a, link_id_b } = await c.req.json<CreateMatchRequest>()
    if (!link_id_a || !link_id_b) {
      return c.json({ error: 'link_id_a and link_id_b are required' }, 400)
    }

    const resultA = await resolveLink(c.env.DB, link_id_a)
    if ('error' in resultA) return c.json({ error: resultA.error }, resultA.status)

    const resultB = await resolveLink(c.env.DB, link_id_b)
    if ('error' in resultB) return c.json({ error: resultB.error }, resultB.status)

    if (resultA.profile_id === resultB.profile_id) {
      return c.json({ error: 'Cannot match same profile' }, 400)
    }

    // Enforce profile_a_id < profile_b_id for the DB CHECK constraint
    const [profileAId, profileBId] = resultA.profile_id < resultB.profile_id
      ? [resultA.profile_id, resultB.profile_id]
      : [resultB.profile_id, resultA.profile_id]

    // Return existing match if one already exists for this pair
    const existing = await c.env.DB.prepare(
      'SELECT match_id FROM matches WHERE profile_a_id = ? AND profile_b_id = ?'
    ).bind(profileAId, profileBId).first<{ match_id: string }>()

    if (existing) {
      return c.json<CreateMatchResponse>({ match_id: existing.match_id })
    }

    const matchId = crypto.randomUUID()

    await c.env.DB.prepare(
      'INSERT INTO matches (match_id, profile_a_id, profile_b_id, score, analysis, comment) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(matchId, profileAId, profileBId, 0, 'pending', 'pending').run()

    return c.json<CreateMatchResponse>({ match_id: matchId }, 201)
  } catch (e) {
    console.error(e)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
})

matchRouter.get('/:matchId', async (c) => {
  try {
    const matchId = c.req.param('matchId')
    const row = await c.env.DB.prepare('SELECT * FROM matches WHERE match_id = ?')
      .bind(matchId).first<MatchRow>()

    if (!row) return c.json({ error: 'Match not found' }, 404)

    return c.json<GetMatchResponse>({
      match_id: row.match_id,
      score: row.score,
      analysis: row.analysis,
      comment: row.comment,
      created_at: row.created_at,
    })
  } catch (e) {
    console.error(e)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
})
