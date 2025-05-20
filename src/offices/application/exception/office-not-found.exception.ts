export class OfficeNotFoundException extends Error {
    constructor(id: number){
        super(`No se ha encontrado la sucursal con ID ${id}`)
        this.name= 'OfficeNotFoundException'
    }
}