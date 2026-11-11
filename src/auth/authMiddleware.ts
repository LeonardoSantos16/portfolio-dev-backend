import { Request, Response, NextFunction } from 'express'
import { tokens } from './tokens'

const BEARER = /^Bearer\s+(\S+)$/i

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const match = BEARER.exec(req.headers.authorization ?? '')

  if (!match || !tokens.verify(match[1])) {
    res.set('WWW-Authenticate', 'Bearer')
    res.status(401).json({ message: 'Não autorizado.' })
    return
  }
  next()
}
