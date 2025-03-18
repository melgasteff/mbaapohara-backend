import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { City } from 'src/cities/entities/city.entity';
import { UsersController } from './users.controller';
import { CreateUser } from './use-cases/create.use-case';
import { UpdateUser } from './use-cases/update.use-case';
import { DeleteUser } from './use-cases/delete.use-case';
import { GetUserById } from './use-cases/getById.use-case';
import { GetAllUsers } from './use-cases/getAllUsers.use-case';
import { ProfileReview } from 'src/profile-reviews/entities/profile-review.entity';


@Module({
  imports: [TypeOrmModule.forFeature([User, City, ProfileReview])],
  controllers: [UsersController],
  providers: [
    UsersService,
    CreateUser,
    UpdateUser,
    DeleteUser,
    GetUserById,
    GetAllUsers, 
  ],
  exports: [UsersService]
})
export class UsersModule { }
