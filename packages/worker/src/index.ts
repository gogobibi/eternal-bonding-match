import { Hono } from 'hono'
import { cors } from 'hono/cors'

export type Env = {
  DB: D1Database
  ANTHROPIC_API_KEY: string
  ENVIRONMENT: string
}

const app = new Hono<{ Bindings: Env }>()

app.use('*', cors({
  origin: ['http://localhost:5173', 'https://eternal-bonding-match.pages.dev'],
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
}))

app.get('/', (c) => c.json({ status: 'ok', service: 'eternal-bonding-worker' }))

export default app
