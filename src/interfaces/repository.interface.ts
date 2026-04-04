import { RepositoryCategory } from "../types/enums";

export interface ICreateRepositoryRequestBody {
  title: string;
  date: string;
  description: string;
  linkDemo?: string;
  linkGithub: string;
  shortDescription?: string;
  idIcon: number;
  category: RepositoryCategory;
  highlighted: boolean;
  imageUrl?: string;
}

export interface IRepositoryAttributes {
  id: number;
  title: string;
  description: string;
  date: Date;
  linkDemo?: string;
  shortDescription?: string;
  linkGithub: string;
  id_icon?: number;
  category: RepositoryCategory;
  imageUrl?: string;
  highlighted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// TODO: estudar o tipo Partial
export type IUpdateRepositoryRequestBody =
  Partial<ICreateRepositoryRequestBody>;
