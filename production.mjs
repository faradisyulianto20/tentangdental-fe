import { createServer } from 'node:http'
import { Readable } from 'node:stream'

const { default: appServer } = await import('./dist/server/server.js')

const port = parseInt(process.env.PORT || '3000', 10)
const host = process.env.HOST || '0.0.0.0'

createServer(async (req, res) => {
  try {
    const protocol = req.headers['x-forwarded-proto'] || 'http'
    const url = new URL(
      req.url,
      `${protocol}://${req.headers.host || 'localhost'}`,
    )

    const init = {
      method: req.method,
      headers: Object.entries(req.headers).map(([k, v]) => [
        k,
        Array.isArray(v) ? v.join(', ') : v,
      ]),
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      init.body = Readable.toWeb(req)
      init.duplex = 'half'
    }

    const request = new Request(url, init)
    const response = await appServer.fetch(request)

    res.statusCode = response.status
    response.headers.forEach((value, key) => res.setHeader(key, value))

    if (response.body) {
      const reader = response.body.getReader()
      const pump = () => {
        reader
          .read()
          .then(({ done, value }) => {
            if (done) return res.end()
            res.write(value)
            pump()
          })
          .catch((err) => {
            console.error('stream error:', err)
            res.end()
          })
      }
      pump()
    } else {
      res.end()
    }
  } catch (err) {
    console.error('request error:', err)
    res.statusCode = 500
    res.end('Internal Server Error')
  }
}).listen(port, host, () => {
  console.log(`[production] SSR server running on http://${host}:${port}`)
})
