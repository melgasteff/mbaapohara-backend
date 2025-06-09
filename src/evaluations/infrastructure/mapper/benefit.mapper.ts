import { Benefit } from "src/evaluations/domain/model/benefit.entity";
import { BenefitTypeORMModel } from "../typeorm/model/benefit.model";
import { ContractMapper } from "./contract.mapper";

export class BenefitsMapper {

    static toDomain(benefitTypeOrm: BenefitTypeORMModel): Benefit {
        const contratos = benefitTypeOrm.contratos ? benefitTypeOrm.contratos.map(contractTypeOrm => ContractMapper.toDomain(contractTypeOrm)) : []
        return new Benefit(benefitTypeOrm.id, benefitTypeOrm.descripcion, contratos);
    }

    static toDomainList(benefitTypeOrmList: BenefitTypeORMModel[]): Benefit[]{
        return benefitTypeOrmList.map(benefitTypeOrm => BenefitsMapper.toDomain(benefitTypeOrm));
    }
    
    static toTypeORMModel(benefit: Benefit): BenefitTypeORMModel{
        const benefitTypeOrm = new BenefitTypeORMModel();
        benefitTypeOrm.id = benefit.getId();
        benefitTypeOrm.descripcion = benefit.getDescripcion();
        benefitTypeOrm.contratos = benefit.getContratos()
        return benefitTypeOrm;
    }

    static toTypeORMModelList(benefitList: Benefit[]): BenefitTypeORMModel[]{
        return benefitList.map(benefit => BenefitsMapper.toTypeORMModel(benefit));
    }
}