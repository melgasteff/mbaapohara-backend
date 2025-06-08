import { Body, Controller, Post, UseFilters } from "@nestjs/common";
import { LoginUseCase } from "src/session-manager/application/use-case/login.use-case";
import { GlobalExceptionFilter } from "src/session-manager/infrastructure/exception-filter/exception-filter";
import { UserDTO } from "../dto/user.dto";


@UseFilters(GlobalExceptionFilter)
@Controller('login')
export class LoginController {
    constructor(
        private readonly loginUC: LoginUseCase,
    ) { }

    @Post()
    async login(@Body() userLogin: UserDTO) {
        const user = await this.loginUC.execute(userLogin.email, userLogin.contrasenha);
        return {
            message: 'Login exitoso',
            user: {
                email: user.getEmail(),
                contrasenha: user.getContrasenha()
            }
        };

    }
}