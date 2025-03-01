import RepositoryIcons from "../../models/repository-icons"

interface PropsIconRepository{
    iconId: number,
    repositoryId: number
}
export class IconsOfRepository{

    async createIconRepository ({iconId, repositoryId} : PropsIconRepository){
        await RepositoryIcons.create({iconId, repositoryId})
    }

    async deleteIconRepository({iconId, repositoryId} : PropsIconRepository){
        await RepositoryIcons.destroy({where: {iconId, repositoryId}})
    }

    async getIconRepository(req : any, res : any){
        const {repositoryId} = req.body;
        const iconsOfRepositories = await RepositoryIcons.findAll({where: {repositoryId}}) 
        return res.status(200).json(iconsOfRepositories)
    }
}
