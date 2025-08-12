import { ReasonRepository } from "src/reasons/domain/repository/reason.repository";
import { ReasonAlreadyExistsException } from "../exception/reason-already-exists.exception";
import { NewReason } from "src/reasons/domain/model/new-reason.entity";
import { Reason } from "src/reasons/domain/model/reason.entity";

export class CreateReasonUseCase {
    constructor(
        private readonly reasonRepo: ReasonRepository
    ) { }

    async execute(description: string, rating: number): Promise<Reason> {
        try {
            const allReasons = await this.reasonRepo.getAll();
            const cityFound = allReasons.find((reason) => reason.getDescription().toLowerCase() === description.toLowerCase());
            if (cityFound) throw new ReasonAlreadyExistsException(description);

            const newReason = new NewReason(description, rating);
            return await this.reasonRepo.create(newReason);
        } catch (error) {
            console.error("Error al crear el motivo:", error);
            throw error;
        }
    }
}