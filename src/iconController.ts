import Icon from "../models/icon";

interface PropsIcon{
    nameIcon?: string
    id?: string
}
export async function createIcon({nameIcon} : PropsIcon){
    await Icon.create({name_icon: nameIcon}).then((icon) => console.log('Icon criado com sucesso', icon)).catch((error) => console.log('erro ao criar icon', error))
}

export async function deleteIcon({id}: PropsIcon){
    await Icon.destroy({where: {id}})
}

export async function updateIcon({id, nameIcon} : PropsIcon){
    await Icon.update({name_icon: nameIcon}, {where: {id}})
}

export async function getIcon({id} : PropsIcon){
   const icon = await Icon.findOne({where: {id}})
   return icon
}

export async function getManyIcons(){
    const icons = await Icon.findAll()
    return icons
}