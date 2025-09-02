import { NewItem } from "src/items/domain/model/new-item.entity";
import { ItemTypeORMModel } from "../typeorm/model/item.typeorm.model";
import { Item } from "src/evaluations/domain/model/item.entity";

export class ItemMapper{
    static toDomain(itemTypeOrm: ItemTypeORMModel): Item{
        return new Item(itemTypeOrm.id, itemTypeOrm.descripcion, itemTypeOrm.idcategory);
    }

    static toTypeORMModel(item: Item): ItemTypeORMModel{
        const itemTypeORM = new ItemTypeORMModel();
        itemTypeORM.descripcion = item.getDescripcion();
        itemTypeORM.idcategory = item.getCategory();
        return itemTypeORM;
    }
}