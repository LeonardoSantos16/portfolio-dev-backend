import Icon from "../../models/icon";

interface PropsIcon{
    nameIcon?: string
    id?: string
}
export class IconController{

    async createIcon({nameIcon} : PropsIcon){
        await Icon.create({name_icon: nameIcon}).then((icon) => console.log('Icon criado com sucesso', icon)).catch((error) => console.log('erro ao criar icon', error))
    }

    async deleteIcon(req : any, res : any){
        const {id} = res.params;
        await Icon.destroy({where: {id}})
    }

    async updateIcon(req : any, res : any){
        const {nameIcon} = req.body;
        const {id} = req.params;
        await Icon.update({name_icon: nameIcon}, {where: {id}})
    }

    async getIcon(req : any, res : any){
    const {id} = req.params
    const icon = await Icon.findOne({where: {id}})
    return res.status(200).json(icon);
    }

    async getManyIcons(req : any, res: any){
        const icons = await Icon.findAll()
        return res.status(200).json(icons)
    }
}
