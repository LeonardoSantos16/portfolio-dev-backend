import RepositoryIcons from "../../models/repository-icons"

interface PropsIconRepository{
    iconId: number,
    repositoryId: number
}
export async function createIconRepository ({iconId, repositoryId} : PropsIconRepository){
    await RepositoryIcons.create({iconId, repositoryId})
}

export async function deleteIconRepository({iconId, repositoryId} : PropsIconRepository){
    await RepositoryIcons.destroy({where: {iconId, repositoryId}})
}

export async function getIconRepository(repositoryId: number){
    const iconsOfRepository = await RepositoryIcons.findAll({where: {repositoryId}}) 
    return iconsOfRepository;
}