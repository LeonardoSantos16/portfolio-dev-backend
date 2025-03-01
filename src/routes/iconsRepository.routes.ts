import { Router } from "express";
import { IconsOfRepository } from "../controllers/repositoryIconsController";

const iconsOfRepository = new IconsOfRepository();
const iconRepository = Router();

iconRepository.get('/', iconsOfRepository.getIconRepository);
iconRepository.post('/', iconsOfRepository.createIconRepository);
iconRepository.delete('/:id', iconsOfRepository.deleteIconRepository);