import Icon from "../../models/icon";
import RepositoryIcons from "../../models/repository-icons"


export class IconsOfRepository{

    async createIconRepository (req : any, res : any){
        const { iconId, repositoryId } = req.body;
        const repositoryIcons = await RepositoryIcons.create({iconId, repositoryId})

        if(!repositoryIcons){
            return res.status(400).json();
        }

        return res.status(201).json();
    }

    async deleteIconRepository(req : any,  res : any){
        const { iconId, repositoryId } = req.body;
        const repositoryIconDeleted = await RepositoryIcons.destroy({where: {iconId, repositoryId}})
       
        if(!repositoryIconDeleted){
            return res.status(400).json();
        }

        return res.status(200).json();
    }

    async getIconRepository(req : any, res : any){
        const {id} = req.params;
        const iconsOfRepositories = await RepositoryIcons.findAll({where: {repositoryId : id}}) 
        const mapperIcon = iconsOfRepositories.map((repositoryIcons) => repositoryIcons.dataValues.iconId)
        const getIcon = await Icon.findAll({where: {id: mapperIcon}})
        if(!iconsOfRepositories){
            return res.status(400).json();
        }

        const response = {
            iconsOfRepositories,
            getIcon
        }

        return res.status(200).json(response)
    }
}
