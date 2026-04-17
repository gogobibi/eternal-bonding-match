import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { profilesRouter } from './routes/profiles'
import { linksRouter } from './routes/links'
import { matchRouter } from './routes/match'

export type Env = {
  DB: D1Database
  ANTHROPIC_API_KEY: string
  ENVIRONMENT: string
  PROXY_SECRET?: string
}

const app = new Hono<{ Bindings: Env }>()

app.use('*', cors({
  origin: ['http://localhost:5173', 'https://eternal-bonding-match.pages.dev'],
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'X-Proxy-Secret'],
}))

// Pages Functions 프록시에서만 요청을 받도록 공유 시크릿 검증
// PROXY_SECRET이 설정되지 않은 환경(로컬 개발)에서는 우회
app.use('*', async (c, next) => {
  const expected = c.env.PROXY_SECRET
  if (!expected) return next()
  if (c.req.method === 'OPTIONS') return next()
  const provided = c.req.header('X-Proxy-Secret')
  if (provided !== expected) {
    return c.json({ error: 'Forbidden' }, 403)
  }
  return next()
})

app.get('/', (c) => c.json({ status: 'ok', service: 'eternal-bonding-worker' }))

app.route('/profiles', profilesRouter)
app.route('/links', linksRouter)
app.route('/match', matchRouter)

export default app
