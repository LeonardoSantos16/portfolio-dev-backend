import { Request, Response } from 'express'
import { AuthService, InvalidCredentialsError } from '../auth/AuthService'
import { loginSchema } from '../schemas/authSchema'

export class AuthController {
  private authService = new AuthService()

  login = async (req: Request, res: Response): Promise<Response> => {
    const parsed = loginSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.issues[0].message })
    }

    try {
      const { email, password } = parsed.data
      const result = await this.authService.login(email, password)
      return res.status(200).json(result)
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        return res.status(401).json({ message: error.message })
      }
      console.error(error)
      return res.status(500).json({ message: 'Falha ao realizar o login.' })
    }
  }
}
