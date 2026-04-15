import { Hono } from 'hono'
import type { Env } from '../index'
import type { LinkRow, MatchRow, CreateMatchRequest } from '../types/api'

const match = new Hono<{ Bindings: Env }>()

match.post('/', async (c) => {
  try {
    const { link_id_a, link_id_b } = await c.req.json<CreateMatchRequest>()
    if (!link_id_a || !link_id_b) {
      return c.json({ error: 'link_id_a and link_id_b are required' }, 400)
    }

    const now = new Date().toISOString()

    const linkA = await c.env.DB.prepare('SELECT * FROM links WHERE link_id = ?')
      .bind(link_id_a).first<LinkRow>()
    if (!linkA) return c.json({ error: 'Link A not found' }, 404)
    if (new Date(linkA.expires_at) < new Date()) {
      return c.json({ error: 'Link A has expired' }, 410)
    }

    const linkB = await c.env.DB.prepare('SELECT * FROM links WHERE link_id = ?')
      .bind(link_id_b).first<LinkRow>()
    if (!linkB) return c.json({ error: 'Link B not found' }, 404)
    if (new Date(linkB.expires_at) < new Date()) {
      return c.json({ error: 'Link B has expired' }, 410)
    }

    // Enforce profile_a_id < profile_b_id for the DB CHECK constraint
    const [profileAId, profileBId] = linkA.profile_id < linkB.profile_id
      ? [linkA.profile_id, linkB.profile_id]
      : [linkB.profile_id, linkA.profile_id]

    // Return existing match if one already exists for this pair
    const existing = await c.env.DB.prepare(
      'SELECT match_id FROM matches WHERE profile_a_id = ? AND profile_b_id = ?'
    ).bind(profileAId, profileBId).first<{ match_id: string }>()

    if (existing) {
      return c.json({ match_id: existing.match_id })
    }

    const matchId = crypto.randomUUID()

    await c.env.DB.prepare(
      'INSERT INTO matches (match_id, profile_a_id, profile_b_id, score, analysis, comment) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(matchId, profileAId, profileBId, 0, 'pending', 'pending').run()

    return c.json({ match_id: matchId }, 201)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return c.json({ error: message }, 500)
  }
})

match.get('/:matchId', async (c) => {
  try {
    const matchId = c.req.param('matchId')
    const row = await c.env.DB.prepare('SELECT * FROM matches WHERE match_id = ?')
      .bind(matchId).first<MatchRow>()

    if (!row) return c.json({ error: 'Match not found' }, 404)

    return c.json({
      match_id: row.match_id,
      score: row.score,
      analysis: row.analysis,
      comment: row.comment,
      created_at: row.created_at,
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return c.json({ error: message }, 500)
  }
})

export default match
