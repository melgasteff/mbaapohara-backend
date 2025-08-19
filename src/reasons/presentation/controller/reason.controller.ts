import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseFilters } from "@nestjs/common";
import { CountReasonsUseCase } from "src/reasons/application/use-case/count.use-case";
import { CreateReasonUseCase } from "src/reasons/application/use-case/create.use-case";
import { DeleteReasonUseCase } from "src/reasons/application/use-case/delete.use-case";
import { GetAllReasonsUseCase } from "src/reasons/application/use-case/get-all.use-case";
import { GetReasonByIdUseCase } from "src/reasons/application/use-case/get-by-id.use-case";
import { UpdateReasonUseCase } from "src/reasons/application/use-case/update.use-case";
import { GlobalExceptionFilter } from "src/reasons/infrastructure/exception-filter/exception-filter";
import { NewReasonDTO } from "../dto/new-reason.dto";
import { ReasonDTO } from "../dto/reason.dto";
import { ReasonDTOMapper } from "../mapper/reason-dto.mapper";
import { ResponseModel } from "src/shared/infrastructure/rest/response-model.dto";

@UseFilters(GlobalExceptionFilter)
@Controller('reasons')
export class ReasonController {
    constructor(
        private readonly createReasonUC: CreateReasonUseCase,
        private readonly updateReasonUC: UpdateReasonUseCase,
        private readonly deleteReasonUC: DeleteReasonUseCase,
        private readonly getReasonByIdUC: GetReasonByIdUseCase,
        private readonly getAllReasonsUC: GetAllReasonsUseCase,
        private readonly countReasonsUC: CountReasonsUseCase
    ) { }

    @Post()
    async createReason (@Body() reasonDto: NewReasonDTO): Promise<ReasonDTO> {
        return ReasonDTOMapper.toDTO(await this.createReasonUC.execute(reasonDto.description, reasonDto.rating));
    }
    @Get()
    async getAllReasons(): Promise<ResponseModel<ReasonDTO>> {
        const reasonDto = (await this.getAllReasonsUC.execute()).map(reason => ReasonDTOMapper.toDTO(reason));
        return {
            count: await this.countReasonsUC.execute(),
            data: reasonDto
        }
    }

    @Get(':id')
    async getReasonById(@Param('id', ParseIntPipe) id: number): Promise<ReasonDTO> {
        return ReasonDTOMapper.toDTO(await this.getReasonByIdUC.execute(id));
    }

    @Put(':id')
    async updateReason(@Param('id', ParseIntPipe) id: number, @Body() reason: ReasonDTO): Promise<ReasonDTO> {
        console.log(reason)
        const reasonToUpdate = ReasonDTOMapper.toDomain(reason);
        const updatedReason = await this.updateReasonUC.execute(id, reasonToUpdate);
        return ReasonDTOMapper.toDTO(updatedReason);
    }

    @Delete(':id')
    deleteReason(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.deleteReasonUC.execute(id);
    }
}