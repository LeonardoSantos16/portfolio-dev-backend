import { Router } from 'express'
import { RepositoryController } from '../controllers/repositoryController'
import { upload } from '../middleware/uploadMiddleware'
import { requireAuth } from '../auth/authMiddleware'
const repositoryRoutes = Router()
const repositoryController = new RepositoryController()

repositoryRoutes.post(
  '/',
  requireAuth,
  upload.single('image'),
  repositoryController.createRepository
)
repositoryRoutes.get(
  '/highlighted',
  repositoryController.getHighlightedRepository
)
repositoryRoutes.get('/:id', repositoryController.getRepository)
repositoryRoutes.delete('/:id', requireAuth, repositoryController.deleteRepository)
repositoryRoutes.get('/', repositoryController.getManyRepository)
repositoryRoutes.put(
  '/:id',
  requireAuth,
  upload.single('image'),
  repositoryController.updateRepository
)

export default repositoryRoutes
