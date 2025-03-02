import { Router } from "express";
import { IconsOfRepository } from "../controllers/repositoryIconsController";

const iconsOfRepository = new IconsOfRepository();
const iconRepository = Router();

iconRepository.get('/:id', iconsOfRepository.getIconRepository);
iconRepository.post('/', iconsOfRepository.createIconRepository);
iconRepository.delete('/:id', iconsOfRepository.deleteIconRepository);

export default iconRepository;