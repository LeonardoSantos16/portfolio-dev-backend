import Icon from "../../models/icon";

export class IconController{

    async createIcon(req: any, res: any){
        console.log(req.body);
        const { name_icon } = req.body;
        const icon = await Icon.create({name_icon})

        if(!icon){
            return res.status(400).json();
        }
        
        return res.status(201).json({message: "Icon criado com sucesso"});
    }

    async deleteIcon(req : any, res : any){
        const {id} = req.params;
        const iconDeleted = await Icon.destroy({where: {id}});
        if(!iconDeleted){
            return res.status(400).json();
        }

        return res.status(200).json({message: "Icon deletado com sucesso"});
    }

    async updateIcon(req : any, res : any){
        const {name_icon} = req.body;
        const {id} = req.params;
        const iconUpdated = await Icon.update({name_icon}, {where: {id}})

        if(!iconUpdated){
            return res.status(400).json();
        }

        return res.status(200).json('icon atualizado com sucesso');
    }

    async getIcon(req : any, res : any){
        const {id} = req.params
        const icon = await Icon.findOne({where: {id}})
        if(!icon){
            return res.status(400).json();
        }
        return res.status(200).json(icon);
    }

    async getManyIcons(req : any, res: any){
        const icons = await Icon.findAll();
        if(!icons){
            return res.status(400).json();
        }
        return res.status(200).json(icons)
    }
}
