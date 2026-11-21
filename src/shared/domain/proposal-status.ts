// Estado de una empresa, un local o un cargo propuesto por un usuario (D10). Lo nuevo queda pendiente hasta que el
// administrador lo apruebe o lo rechace. Lo rechazado no se muestra, pero queda registrado.
export enum ProposalStatus {
    Pending = 'pendiente',
    Approved = 'aprobada',
    Rejected = 'rechazada',
}
