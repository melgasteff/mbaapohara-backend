import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { HttpException, HttpStatus } from "@nestjs/common";
import { ProfileReview } from "../entities/profile-review.entity";
import { UpdateProfileReviewDto } from "../dto/update-profile-review.dto";

export class UpdateProfileReview {
    constructor(
        @InjectRepository(ProfileReview) private profileReviewRepository: Repository<ProfileReview>
    ) { }

    async execute(id: number, review: UpdateProfileReviewDto) {
        const reviewFound = await this.profileReviewRepository.findOne({ where: { id }, relations: ['user'] })
        if (!reviewFound) throw new HttpException('No se ha encontrado la reseña ', HttpStatus.NOT_FOUND);

        try {
            const updatedReview = Object.assign(reviewFound, review)
            return this.profileReviewRepository.save(updatedReview)

        } catch (error) {
            throw new HttpException('No se ha podido actualizar la reseña', HttpStatus.INTERNAL_SERVER_ERROR)
        }

    }
}