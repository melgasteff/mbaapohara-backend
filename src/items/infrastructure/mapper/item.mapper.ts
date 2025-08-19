import { Item } from "src/items/domain/model/item.entity";
import { NewItem } from "src/items/domain/model/new-item.entity";
import { ItemTypeORMModel } from "../typeorm/model/item.typeorm.model";

export class ItemMapper{
    static toDomain(itemTypeOrm: ItemTypeORMModel): Item{
        return new Item(itemTypeOrm.id, itemTypeOrm.descripcion, itemTypeOrm.idcategory);
    }

    static toTypeORMModel(newItem: NewItem): ItemTypeORMModel{
        const cityTypeORM = new ItemTypeORMModel();
        cityTypeORM.descripcion = newItem.getDescripcion();
        cityTypeORM.idcategory = newItem.getPais();
        return cityTypeORM;
    }
}