import { Hono } from 'hono'
import type { Env } from '../index'
import { JSON_COLUMNS, parseJsonColumns, type ProfileRow } from '../types/api'

const profiles = new Hono<{ Bindings: Env }>()

profiles.post('/', async (c) => {
  try {
    const body = await c.req.json<Record<string, unknown>>()
    const profileId = crypto.randomUUID()

    const columns = [
      'profile_id', 'nickname', 'server',
      'me_gender', 'me_gender_custom', 'me_age', 'me_weekday', 'me_weekend',
      'you_gender', 'you_gender_custom', 'you_age',
      'you_weekday_any', 'you_weekday', 'you_weekend_any', 'you_weekend',
      'coupling_priority', 'me_race', 'you_race',
      'my_jobs', 'my_selected', 'my_custom',
      'you_contents_enabled', 'you_jobs', 'you_selected', 'you_custom',
      'play_styles',
      'server_move', 'server_cross', 'covenant_plan',
      'extra_items',
    ]

    const values: unknown[] = columns.map((col) => {
      if (col === 'profile_id') return profileId
      const val = body[col]
      if (val === undefined || val === null) return null
      if (JSON_COLUMNS.includes(col as keyof ProfileRow) && typeof val !== 'string') {
        return JSON.stringify(val)
      }
      return val
    })

    const placeholders = columns.map(() => '?').join(', ')
    const sql = `INSERT INTO profiles (${columns.join(', ')}) VALUES (${placeholders})`

    await c.env.DB.prepare(sql).bind(...values).run()

    return c.json({ profile_id: profileId }, 201)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return c.json({ error: message }, 500)
  }
})

profiles.get('/:profileId', async (c) => {
  try {
    const profileId = c.req.param('profileId')
    const row = await c.env.DB.prepare('SELECT * FROM profiles WHERE profile_id = ?')
      .bind(profileId)
      .first<ProfileRow>()

    if (!row) return c.json({ error: 'Profile not found' }, 404)

    return c.json(parseJsonColumns(row))
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return c.json({ error: message }, 500)
  }
})

export default profiles
