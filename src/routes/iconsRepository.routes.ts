import { Router } from 'express'
import { IconsOfRepositoryController } from '../controllers/repositoryIconsController'

const iconsOfRepository = new IconsOfRepositoryController()
const iconRepository = Router()

iconRepository.get('/:id', iconsOfRepository.getIconRepository)
iconRepository.post('/', iconsOfRepository.createIconRepository)
iconRepository.delete('/', iconsOfRepository.deleteIconRepository)

export default iconRepository
