import { HttpException, HttpStatus } from "@nestjs/common";
import { UpdateUserDto } from "../dto/update-user.dto";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { City } from "src/cities1/entities/city.entity";
import { User } from "../entities/user.entity";

export class UpdateUser {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(City) private cityRepository: Repository<City>,
    ) { }

    async execute(id: number, user: UpdateUserDto) {
        const userFound = await this.userRepository.findOne({ where: { id }, relations: ['ciudad'] })
        if (!userFound) return new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);

        const userCity = Number(user.ciudad);
        const cityFound = await this.cityRepository.findOne({ where: { id: userCity } })
        console.log("La ciudad es ", cityFound)
        if (!cityFound) throw new HttpException("La ciudad no existe", HttpStatus.NOT_FOUND)

        try {
            const updatedUser = Object.assign(userFound, user)
            return this.userRepository.save(updatedUser);
        } catch (error) {
            throw new HttpException("Error al actualizar el usuario", HttpStatus.INTERNAL_SERVER_ERROR)
        }


    }
}