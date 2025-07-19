import { Router } from 'express'
import { RepositoryController } from '../controllers/repositoryController'
import { upload } from '../middleware/uploadMiddleware'
const repositoryRoutes = Router()
const repositoryController = new RepositoryController()

repositoryRoutes.post(
  '/',
  upload.single('image'),
  repositoryController.createRepository
)
repositoryRoutes.get(
  '/highlighted',
  repositoryController.getHighlightedRepository
)
repositoryRoutes.get('/:id', repositoryController.getRepository)
repositoryRoutes.delete('/:id', repositoryController.deleteRepository)
repositoryRoutes.get('/', repositoryController.getManyRepository)
repositoryRoutes.put(
  '/:id',
  upload.single('image'),
  repositoryController.updateRepository
)

export default repositoryRoutes
