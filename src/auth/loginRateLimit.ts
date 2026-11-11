import { rateLimit } from 'express-rate-limit'

// Store em memória: em ambiente serverless (Vercel) o limite vale por instância,
// então é uma mitigação parcial (ver openspec/changes/add-jwt-auth/design.md, D11).
export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { message: 'Muitas tentativas de login. Tente novamente mais tarde.' },
})
