import { Hono } from 'hono'
import type { Env } from '../index'
import type { CreateProfileRequest, CreateProfileResponse } from '../types/api'

const JSON_COLUMNS = [
  'me_age', 'me_weekday', 'me_weekend', 'you_age', 'you_weekday', 'you_weekend',
  'coupling_priority', 'me_race', 'you_race', 'my_jobs', 'my_selected', 'my_custom',
  'you_jobs', 'you_selected', 'you_custom', 'play_styles', 'extra_items',
] as const

export const profilesRouter = new Hono<{ Bindings: Env }>()

profilesRouter.post('/', async (c) => {
  try {
    const body = await c.req.json<CreateProfileRequest>()
    const profile_id = crypto.randomUUID()

    const columns = [
      'profile_id', 'nickname', 'server',
      'me_gender', 'me_gender_custom', 'me_age', 'me_weekday', 'me_weekend',
      'you_gender', 'you_gender_custom', 'you_age',
      'you_weekday_any', 'you_weekday', 'you_weekend_any', 'you_weekend',
      'coupling_priority', 'me_race', 'you_race',
      'my_jobs', 'my_selected', 'my_custom',
      'you_contents_enabled', 'you_jobs', 'you_selected', 'you_custom',
      'play_styles', 'server_move', 'server_cross', 'covenant_plan', 'extra_items',
    ]

    const values = columns.map((col) => {
      if (col === 'profile_id') return profile_id
      const value = (body as Record<string, unknown>)[col]
      if ((JSON_COLUMNS as readonly string[]).includes(col) && value !== undefined) {
        return JSON.stringify(value)
      }
      return value ?? null
    })

    const placeholders = columns.map(() => '?').join(', ')
    const sql = `INSERT INTO profiles (${columns.join(', ')}) VALUES (${placeholders})`

    await c.env.DB.prepare(sql).bind(...values).run()

    return c.json<CreateProfileResponse>({ profile_id }, 201)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return c.json({ error: message }, 500)
  }
})
