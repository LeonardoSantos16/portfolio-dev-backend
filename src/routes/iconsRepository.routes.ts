import { Router } from 'express'
import { IconsOfRepositoryController } from '../controllers/repositoryIconsController'
import { requireAuth } from '../auth/authMiddleware'

const iconsOfRepository = new IconsOfRepositoryController()
const iconRepository = Router()

iconRepository.get('/:id', iconsOfRepository.getIconRepository)
iconRepository.post('/', requireAuth, iconsOfRepository.createIconRepository)
iconRepository.delete('/', requireAuth, iconsOfRepository.deleteIconRepository)

export default iconRepository
