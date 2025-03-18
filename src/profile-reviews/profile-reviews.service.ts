import { Injectable } from "@nestjs/common"
import { GetProfileReviews } from "./use-cases/getProfileReviews.use-case"
import { UpdateProfileReview } from "./use-cases/updateProfileReview.use-case"
import { CreateProfileReview } from "./use-cases/create.use-case"
import { CreateProfileReviewDto } from "./dto/create-profile-review.dto"
import { UpdateProfileReviewDto } from "./dto/update-profile-review.dto"
import { DeleteProfileReview } from "./use-cases/delete.use-case"


@Injectable()
export class ProfileReviewsService {
  constructor(
    private readonly getProfileReviewsUC : GetProfileReviews,
    private readonly updateProfileReviewUC : UpdateProfileReview,
    private readonly createProfileReviewUC : CreateProfileReview,
    private readonly deleteProfileReviewUC : DeleteProfileReview
  ){}

  createProfileReview(id: number, review : CreateProfileReviewDto){
    return this.createProfileReviewUC.execute(id, review)
  }

  getProfileReviews(id:number){
    return this.getProfileReviewsUC.execute(id)
  }

  updateProfileReview(id:number, review :UpdateProfileReviewDto){
    return this.updateProfileReviewUC.execute(id, review)
  }

  deleteProfileReview(id :number){
    return this.deleteProfileReviewUC.execute(id)
  }
}
