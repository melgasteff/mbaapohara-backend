export class BenefitDTO {
  id: number;
  descripcion: string;
  contratos: {
    id: number;
    descripcion: string;
  }[];
}

