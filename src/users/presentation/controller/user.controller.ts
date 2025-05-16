import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseFilters } from "@nestjs/common";
import { CountUsersUseCase } from "src/users/application/use-case/count.use-case";
import { CreateUserUseCase } from "src/users/application/use-case/create.use-case";
import { DeleteUserUseCase } from "src/users/application/use-case/delete.use-case";
import { GetAllUsersUseCase } from "src/users/application/use-case/get-all.use-case";
import { GetUserByIdUseCase } from "src/users/application/use-case/get-by-id.use-case";
import { UpdateUserUseCase } from "src/users/application/use-case/update.use-case";
import { UserDTOMapper } from "../mapper/user-dto.mapper";
import { NewUserDTO } from "../dto/new-user.dto";
import { UserDTO } from "../dto/user.dto";
import { ResponseModel } from "src/shared/infrasctructure/rest/response-model.dto";
import { GlobalExceptionFilter } from "src/users/infrastructure/exception-filter/exception-filter";

@UseFilters(GlobalExceptionFilter)
@Controller('users')
export class UserController {
    constructor(
        private readonly createUserUC: CreateUserUseCase,
        private readonly updateUserUC: UpdateUserUseCase,
        private readonly deleteUserUC: DeleteUserUseCase,
        private readonly getUserByIdUC: GetUserByIdUseCase,
        private readonly getAllUsersUC: GetAllUsersUseCase,
        private readonly countUsersUC: CountUsersUseCase
    ) { }

    @Post()
    async createUser(@Body() userDto: NewUserDTO): Promise<UserDTO> {
        const newUserDto = await this.createUserUC.execute(
            userDto.nombre,
            userDto.apellido,
            userDto.usuario,
            userDto.email,
            userDto.contrasenha,
            userDto.idciudad,
            userDto.tipoUsuario,
            userDto.descripcion
        )
        return UserDTOMapper.toDTO(newUserDto);
    }

    @Get()
    async getAllUsers(): Promise<ResponseModel<UserDTO>> {
        const userDto = (await this.getAllUsersUC.execute()).map(user => UserDTOMapper.toDTO(user));
        
        return {
            count: await this.countUsersUC.execute(),
            data: userDto
        }
    }

    @Get(':id')
    async getUserById(@Param('id', ParseIntPipe) id: number): Promise<UserDTO> {
        return UserDTOMapper.toDTO(await this.getUserByIdUC.execute(id));
    }

    @Put(':id')
    async updateUser(@Param('id', ParseIntPipe) id: number, @Body() user: UserDTO): Promise<UserDTO> {
        const userToUpdate = UserDTOMapper.toDomain(user);
        const updatedUser = await this.updateUserUC.execute(id, userToUpdate);
        return UserDTOMapper.toDTO(updatedUser);
    }

    @Delete(':id')
    deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.deleteUserUC.execute(id);
    }
}