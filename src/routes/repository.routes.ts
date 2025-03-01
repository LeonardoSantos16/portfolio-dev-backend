import { Router } from "express";
import { RepositoryController } from "../controllers/repositoryController";
const repositoryRouter = Router()
const repositoryController = new RepositoryController()

repositoryRouter.post('/', repositoryController.createRepository);
repositoryRouter.get('/:id', repositoryController.getRepository);
repositoryRouter.delete('/:id', repositoryController.deleteRepository);
repositoryRouter.get('/', repositoryController.getManyRepository);
repositoryRouter.put('/:id', repositoryController.updateRepository)