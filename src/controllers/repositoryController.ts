import Repository from "../../models/repository";

interface PropsRepository{
  id?: string
  title: string
  date: Date
  description: string
  linkDemo: string
  linkGithub: string
  idIcon: number
}

export class RepositoryController{

   async createRepository (req: any, res: any) {
    const  {title, date, description, linkDemo, linkGithub } = req.body

    const repository = await Repository.create({
        title,
        date,
        description,
        link_demo: linkDemo,
        link_github: linkGithub
    })

    if(!repository){
        return res.status(400)
    }
    return res.status(201).json({message: 'repositorio criado com sucesso'});
    }

    async deleteRepository (req : any, res : any){
        const { id } = req.params;
        const repositoryDeleted = await Repository.destroy({
            where: {
                id
            }
        })

        if(repositoryDeleted){
            return res.status(204).json()
        }
        return res.status(400).json()
    }

    async updateRepository (req : any, res : any){
        const {title,
        date,
        description,
        linkDemo,
        linkGithub}
        = req.body;
        const { id } = req.params;

        const repositoryUpdated = await Repository.update({
            title,
            date,
            description,
            link_demo: linkDemo,
            link_github: linkGithub
        }, {where: {
            id
            }}
        )
        if(!repositoryUpdated){
            return res.status(400).json();
        }

        return res.status(200).json('repositório atualizado com sucesso');
    }

    async getRepository(req: any, res: any){
        const {id} = req.params
        const repository = await Repository.findOne({ where: {id}})
        if(!repository){
            return res.status(404).json({message: 'repositório não encontrado'})
        }
        return res.status(200).json(repository);
    }

    async getManyRepository (req : any, res:any){
        const allRepositories = await Repository.findAll()
        if(!allRepositories){
            return res.status(404).json({message: 'repositório não encontrado'})
        }
        return res.status(200).json(allRepositories)
    }
}
