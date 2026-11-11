import { Router } from 'express'
import { AuthController } from '../controllers/authController'
import { loginRateLimit } from '../auth/loginRateLimit'

const authController = new AuthController()
const authRoutes = Router()

authRoutes.post('/login', loginRateLimit, authController.login)

export default authRoutes
