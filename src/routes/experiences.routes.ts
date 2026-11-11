import { Router } from 'express'
import { experiencesController } from '../controllers/experiencesController'
import { requireAuth } from '../auth/authMiddleware'

const experienceController = new experiencesController()
const experienceRouter = Router()

experienceRouter.post('/', requireAuth, experienceController.createExperience)
experienceRouter.get('/:id', experienceController.getExperience)
experienceRouter.delete('/:id', requireAuth, experienceController.deleteExperience)
experienceRouter.put('/:id', requireAuth, experienceController.updateExperience)
experienceRouter.get('/', experienceController.getExperienceByType)
export default experienceRouter
