// Roles y estados de cuenta (D5: un solo rol administrador, que también modera).
// Los usan auth (módulo completo), users y los guards de todos los módulos.
export enum UserRole {
    User = 'usuario',
    Admin = 'administrador',
}

export enum AccountStatus {
    Active = 'activo',
    Blocked = 'bloqueado',
}
