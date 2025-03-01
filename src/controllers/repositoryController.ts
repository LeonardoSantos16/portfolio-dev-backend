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

   async createRepository ({title, date, description, linkDemo, linkGithub} : PropsRepository) {
    await Repository.create({
        title,
        date,
        description,
        link_demo: linkDemo,
        link_github: linkGithub
    }).then((repository: any) => {
        console.log("Repositório criado com sucesso:", repository);
    })
    .catch((error: any) => {
        console.error("Erro ao criar o repositório:", error);
    });
    }

    async deleteRepository (id : string){
        await Repository.destroy({
            where: {
                id: id
            }
        }).then(() => {
            console.log('Repositório deletado com sucesso')
        }).then((error: any) => {
            console.error("Erro ao criar o repositório:", error)
        })
    }

    async updateRepository (req : any, res : any){
        const {title,
        date,
        description,
        linkDemo,
        linkGithub}
        = req.body;
        const id = req.params;

        await Repository.update({
            title,
            date,
            description,
            link_demo: linkDemo,
            link_github: linkGithub
        }, {where: {
            id: id
            }}
        ).then((repository: any) => {
            console.log("Repositório atualizado com sucesso:", repository);
        })
        .catch((error: any) => {
            console.error("Erro ao atualizar o repositório:", error);
        });
    }

    async getRepository(req: any, res: any){
        const {id} = req.params
        const repository = Repository.findOne({ where: {id}})
        if(!repository){
            return res.status(404).json({message: 'repositório não encontrado'})
        }
        return res.status(200).json(repository);
    }

    async getManyRepository (req : any, res:any){
        const allRepositories = Repository.findAll()
        if(!allRepositories){
            return res.status(404).json({message: 'repositório não encontrado'})
        }
        return res.status(200).json(allRepositories)
    }
}
