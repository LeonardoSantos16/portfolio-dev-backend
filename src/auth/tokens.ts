import { env } from '../env'
import { createTokenService } from './tokenService'

export const tokens = createTokenService({
  secret: env.JWT_SECRET,
  expiresIn: env.JWT_EXPIRES_IN,
})
