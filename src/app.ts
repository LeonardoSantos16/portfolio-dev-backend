import express from 'express'
import cors from 'cors'
import routes from './routes'

const app = express()

// A Vercel fica na frente da API como um único proxy; sem isso, o rate limit
// enxergaria o IP do proxy em vez do IP real do cliente.
app.set('trust proxy', 1)

app.use(cors())
app.use(express.json())
app.use(routes)

export default app
