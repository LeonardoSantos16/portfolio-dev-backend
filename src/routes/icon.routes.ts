import { Router } from "express";
import { IconController } from "../controllers/iconController";
import { requireAuth } from "../auth/authMiddleware";

const iconRoutes = Router()
const iconController = new IconController()

iconRoutes.get('/:id', iconController.getIcon);
iconRoutes.get('/', iconController.getManyIcons);
iconRoutes.post('/', requireAuth, iconController.createIcon);
iconRoutes.delete('/:id', requireAuth, iconController.deleteIcon);
iconRoutes.put('/:id', requireAuth, iconController.updateIcon);

export default iconRoutes;