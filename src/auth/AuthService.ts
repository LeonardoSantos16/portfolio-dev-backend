import bcrypt from 'bcryptjs'
import { env } from '../env'
import { tokens } from './tokens'

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Credenciais inválidas.')
  }
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export class AuthService {
  async login(email: string, password: string) {
    // Compara a senha sempre, mesmo se o e-mail não bater, para que o tempo
    // de resposta não revele se o e-mail existe.
    const passwordMatches = await bcrypt.compare(password, env.ADMIN_PASSWORD_HASH)
    const emailMatches = normalizeEmail(email) === normalizeEmail(env.ADMIN_EMAIL)

    if (!emailMatches || !passwordMatches) {
      throw new InvalidCredentialsError()
    }

    return { token: tokens.sign(), expiresIn: env.JWT_EXPIRES_IN }
  }
}
