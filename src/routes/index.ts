import { Router } from 'express'
import iconRoutes from './icon.routes'
import repositoryRoutes from './repository.routes'
import iconRepository from './iconsRepository.routes'
import experiencesRoutes from './experiences.routes'
import authRoutes from './auth.routes'
const routes = Router()

routes.use('/icon', iconRoutes)
routes.use('/repository', repositoryRoutes)
routes.use('/iconRepository', iconRepository)
routes.use('/experiences', experiencesRoutes)
routes.use('/auth', authRoutes)
export default routes
