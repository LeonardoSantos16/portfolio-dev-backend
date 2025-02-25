import { where } from "sequelize";
import Repository from "../models/repository";

interface PropsRepository{
  title: string
  date: Date
  description: string
  link_demo: string
  link_github: string
}


export async function createRepository ({title, date, description, link_demo, link_github} : PropsRepository) {
    await Repository.create({
        title,
        date,
        description,
        link_demo,
        link_github
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

export async function updateRepository ({id, title, date, description, link_demo, link_github} : PropsRepository){
    await Repository.update({
        title,
        date,
        description,
        link_demo,
        link_github
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
    Repository.findOne({ where: { id: id}})
}

export async function getManyRepository (id: string){
    Repository.findAll()
}
