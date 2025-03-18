import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { HttpException, HttpStatus } from "@nestjs/common";
import { User } from "../../users/entities/user.entity";
import { ProfileReview } from "../entities/profile-review.entity";


export class GetProfileReviews {
    constructor(
        @InjectRepository(User) private userRepository : Repository<User>,
        @InjectRepository(ProfileReview) private profileReviewRepository: Repository<ProfileReview>
    ){}

    async execute(id: number){
        const userFound = await this.userRepository.findOne({where : {id}})
        if(!userFound) throw new HttpException('No se ha encontrado el usuario', HttpStatus.NOT_FOUND)

        return this.profileReviewRepository.find({where : {user : {id}}})
    }
}