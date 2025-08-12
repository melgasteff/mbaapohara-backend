import { ReasonRepository } from "src/reasons/domain/repository/reason.repository";

export class CountReasonsUseCase{
    constructor(
        private readonly reasonRepo: ReasonRepository
    ){}

    execute (){
        try {
            return this.reasonRepo.count()
        } catch (error) {
            console.error("Error al contar los motivos", error)
            throw new error
        }
    }
}