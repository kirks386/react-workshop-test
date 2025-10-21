interface Env {
  ENV_DATA: string
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.pathname.startsWith('/api/')) {
      if (request.method === 'POST') {
        try {
          const body: unknown = await request.json()
          let fe_input = ''
          if (
            typeof body === 'object' &&
            body !== null &&
            'fe_input' in body &&
            typeof (body as Record<string, unknown>).fe_input === 'string'
          ) {
            fe_input = (body as Record<string, unknown>).fe_input as string
          }
          const isValidInput = (s: string) => {
            if (s.length >= 32) return false
            for (let i = 0; i < s.length; i++) {
              const c = s.charCodeAt(i)
              if (c >= 0xd800 && c <= 0xdbff) {
                if (i + 1 >= s.length) return false
                const d = s.charCodeAt(i + 1)
                if (!(d >= 0xdc00 && d <= 0xdfff)) return false
                i++
              } else if (c >= 0xdc00 && c <= 0xdfff) {
                return false
              }
            }
            return true
          }

          if (!isValidInput(fe_input)) {
            return new Response(JSON.stringify({ error: 'Invalid fe_input' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            })
          }

          console.log('fe_input:', fe_input)
        } catch (err) {
          console.log('Failed to parse JSON body', err)
        }
      }
      const name = typeof env?.ENV_DATA === 'string' && env.ENV_DATA.length > 0
        ? env.ENV_DATA
        : 'React Workshop Demo!'
      return Response.json({ name })
    }
    return new Response(null, { status: 404 })
  },
} satisfies ExportedHandler<Env>
