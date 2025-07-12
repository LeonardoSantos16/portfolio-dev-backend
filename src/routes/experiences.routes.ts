import { Router } from 'express'
import { experiencesController } from '../controllers/experiencesController'

const experienceController = new experiencesController()
const experienceRouter = Router()

experienceRouter.post('/', experienceController.createExperience)
experienceRouter.get('/:id', experienceController.getExperience)
experienceRouter.delete('/:id', experienceController.deleteExperience)
experienceRouter.put('/:id', experienceController.updateExperience)
experienceRouter.get('/', experienceController.getExperienceByType)
export default experienceRouter
