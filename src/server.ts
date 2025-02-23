import Repository from "../models/repository";

Repository.create({
    title: 'Meu Repositório',
    date: new Date(),
    description: 'Descrição do repositório.',
    link_demo: 'http://linkdemodorepositorio.com',
    link_github: 'https://github.com/meu-repositorio'
  })
    .then((repository: any) => {
      console.log("Repositório criado com sucesso:", repository);
    })
    .catch((error: any) => {
      console.error("Erro ao criar o repositório:", error);
    });