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


export async function createRepository ({title, date, description, linkDemo, linkGithub} : PropsRepository) {
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

export async function deleteRepository (id : string){
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

export async function updateRepository ({id, title, date, description, linkDemo, linkGithub} : PropsRepository){
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

export async function getRepository (id: string){
    const repository = Repository.findOne({ where: { id: id}})
    return repository;
}

export async function getManyRepository (){
    const allRepositories = Repository.findAll()
    return allRepositories;
}
