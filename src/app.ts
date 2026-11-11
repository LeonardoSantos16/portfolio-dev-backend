import express from 'express'
import cors from 'cors'
import routes from './routes'

const app = express()

// Na Vercel há exatamente um proxy confiável na frente da API; sem isso, o rate
// limit enxergaria o IP do proxy. Fora dela (dev, self-host) o X-Forwarded-For
// vem do cliente e não é confiável. A Vercel define VERCEL=1 automaticamente.
if (process.env.VERCEL) {
  app.set('trust proxy', 1)
}

app.use(cors())
app.use(express.json())
app.use(routes)

export default app
