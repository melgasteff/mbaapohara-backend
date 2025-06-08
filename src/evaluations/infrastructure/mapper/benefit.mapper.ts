import { Benefit } from "src/evaluations/domain/model/benefit.entity";
import { BenefitTypeORMModel } from "../typeorm/model/benefit.model";
import { Contract } from "src/evaluations/domain/model/contract.entity";
import { ContractMapper } from "./contract.mapper";

export class BenefitsMapper {

    static toDomain(benefitTypeOrm: BenefitTypeORMModel): Benefit {
        const contratos = benefitTypeOrm.contratos.map(contractTypeOrm => ContractMapper.toDomain(contractTypeOrm)) 
        return new Benefit(benefitTypeOrm.id, benefitTypeOrm.descripcion, contratos);
    }

    static toDomainList(benefitTypeOrmList: BenefitTypeORMModel[]): Benefit[]{
        return benefitTypeOrmList.map(benefitTypeOrm => BenefitsMapper.toDomain(benefitTypeOrm));
    }    
}