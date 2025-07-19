import { Router } from 'express'
import { RepositoryController } from '../controllers/repositoryController'
import multer from 'multer'
const repositoryRoutes = Router()
const repositoryController = new RepositoryController()
const upload = multer({ storage: multer.memoryStorage() })

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
repositoryRoutes.put('/:id', repositoryController.updateRepository)

export default repositoryRoutes
