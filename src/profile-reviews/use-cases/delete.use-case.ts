import { InjectRepository } from "@nestjs/typeorm";
import { ProfileReview } from "../entities/profile-review.entity";
import { Repository } from "typeorm";
import { HttpException, HttpStatus } from "@nestjs/common";

export class DeleteProfileReview {
    constructor(
        @InjectRepository(ProfileReview) private profileReviewRepository: Repository<ProfileReview>
    ) { }

    async execute(id: number) {
        const result = await this.profileReviewRepository.delete({ id })
        if (result.affected === 0) throw new HttpException('No se ha podido eliminar la reseña', HttpStatus.NOT_FOUND)

        return result
    }
}