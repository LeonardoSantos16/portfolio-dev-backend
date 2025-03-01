import { Router } from "express";
import iconRoutes from "./icon.routes";
import repositoryRoutes from "./repository.routes";
import iconRepository from "./iconsRepository.routes";

const routes = Router();

routes.use('/icon', iconRoutes);
routes.use('/repository', repositoryRoutes);
routes.use('/iconRepository', iconRepository);

export default routes;