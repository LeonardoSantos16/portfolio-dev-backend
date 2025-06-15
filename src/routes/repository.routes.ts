import { Router } from "express";
import { RepositoryController } from "../controllers/repositoryController";
const repositoryRoutes = Router();
const repositoryController = new RepositoryController();

repositoryRoutes.post("/", repositoryController.createRepository);
repositoryRoutes.get("/:id", repositoryController.getRepository);
repositoryRoutes.delete("/:id", repositoryController.deleteRepository);
repositoryRoutes.get("/", repositoryController.getManyRepository);
repositoryRoutes.put("/:id", repositoryController.updateRepository);

export default repositoryRoutes;
