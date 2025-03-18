
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { HttpException, HttpStatus } from "@nestjs/common";
import { User } from "src/users/entities/user.entity";
import { CreateProfileReviewDto } from "../dto/create-profile-review.dto";
import { ProfileReview } from "../entities/profile-review.entity";


export class CreateProfileReview {
    constructor(
    @InjectRepository(User) private userRepository : Repository<User>,
    @InjectRepository(ProfileReview) private profileReviewRepository : Repository <ProfileReview>
){}

    async execute(id:number, review: CreateProfileReviewDto){
      const userFound = await this.userRepository.findOne({where: {id}, relations: ['reviews']})
      if(!userFound) throw new HttpException("No se ha encontrado el usuario", HttpStatus.NOT_FOUND)
        
        // if(!postFound.rates) postFound.rates = []
        const newReview = this.profileReviewRepository.create({...review, user: userFound})
        const savedReview = await this.profileReviewRepository.save(newReview)
      
        userFound.reviews.push(savedReview)
        this.userRepository.save(userFound)
        
        return savedReview.user
    }
}