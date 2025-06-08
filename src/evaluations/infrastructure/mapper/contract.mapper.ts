import { Contract } from "src/evaluations/domain/model/contract.entity";
import { ContractTypeORMModel } from "../typeorm/model/contract.typeorm.model";

export class ContractMapper {
  static toDomain(contractOrm: ContractTypeORMModel): Contract {
    return new Contract(
      contractOrm.id,
      contractOrm.descripcion,
    );
  }

  static toTypeORMModel(contract: Contract): ContractTypeORMModel {
    const contractOrm = new ContractTypeORMModel();
    contractOrm.id = contract.getId();
    contractOrm.descripcion = contract.descripcion;
    return contractOrm;
  }
}