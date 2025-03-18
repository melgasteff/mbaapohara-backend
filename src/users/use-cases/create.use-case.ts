import { HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { City } from "src/cities/entities/city.entity";
import { CreateUserDto } from "../dto/create-user.dto";

export class CreateUser {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(City) private cityRepository: Repository<City>
  ) { }

  async execute(user: CreateUserDto) {
    const userFound = await this.userRepository.findOne({ where: { usuario: user.usuario }, relations: ['ciudad']} )
    if (userFound) throw new HttpException(`El nombre de usuario <${user.usuario}> ya existe`, HttpStatus.CONFLICT);

    const userCity = Number (user.ciudad);
    const cityFound = await this.cityRepository.findOne({where: {id : userCity}})
    console.log("La ciudad es ",cityFound)
    if(!cityFound)  throw new HttpException("La ciudad no existe", HttpStatus.NOT_FOUND)

    try {
      const newUser = this.userRepository.create(user)
      return this.userRepository.save(newUser)
    } catch (error) {
      console.error("Error al crear usuario", error)
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}