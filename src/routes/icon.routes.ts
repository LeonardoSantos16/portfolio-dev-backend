import { Router } from "express";
import { IconController } from "../controllers/iconController";

const iconRoutes = Router()
const iconController = new IconController()

iconRoutes.get('/:id', iconController.getIcon);
iconRoutes.get('/', iconController.getManyIcons);
iconRoutes.post('/', iconController.createIcon);
iconRoutes.delete('/:id', iconController.deleteIcon);
iconRoutes.put('/:id', iconController.updateIcon);

export default iconRoutes;