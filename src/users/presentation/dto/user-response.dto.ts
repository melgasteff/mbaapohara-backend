// Respuesta de la API para un usuario. No incluye la contraseña ni su hash.
export class UserResponseDTO {
    id: number
    nombre: string
    apellido: string
    usuario: string
    email: string
    idciudad: number
    tipoUsuario: string
    descripcion: string
}
