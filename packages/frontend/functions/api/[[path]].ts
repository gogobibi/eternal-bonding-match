interface Env {
  WORKER_URL: string
  PROXY_SECRET?: string
}

const HOP_BY_HOP_HEADERS = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailers',
  'transfer-encoding',
  'upgrade',
  'host',
  'content-length',
])

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context

  if (!env.WORKER_URL) {
    return new Response(
      JSON.stringify({ error: 'WORKER_URL is not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const incomingUrl = new URL(request.url)
  const forwardedPath = incomingUrl.pathname.replace(/^\/api/, '') || '/'
  const targetUrl = new URL(forwardedPath + incomingUrl.search, env.WORKER_URL)

  const headers = new Headers()
  request.headers.forEach((value, key) => {
    if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
      headers.set(key, value)
    }
  })

  if (env.PROXY_SECRET) {
    headers.set('X-Proxy-Secret', env.PROXY_SECRET)
  }

  const init: RequestInit = {
    method: request.method,
    headers,
    redirect: 'manual',
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = request.body
  }

  return fetch(targetUrl.toString(), init)
}
