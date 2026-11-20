import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

// Registro de decisiones de moderación (política, sección 9). Guarda la huella SHA-256 del texto, nunca el texto.
@Entity({ name: 'decisiones_moderacion' })
export class ModerationDecisionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    /** Reseña moderada; `null` en las pruebas del administrador. La clave foránea se agrega en la Fase 3. */
    @Column({ name: 'id_resena', type: 'int', nullable: true })
    idResena: number | null;

    @Column({ name: 'huella_texto', type: 'char', length: 64 })
    huellaTexto: string;

    @Column({ type: 'varchar', length: 20 })
    resultado: string;

    @Column({ type: 'varchar', length: 10, nullable: true })
    categoria: string | null;

    @Column({ type: 'varchar', length: 10 })
    origen: string;

    @Column({ type: 'text', array: true, default: () => "'{}'" })
    reglas: string[];

    @Column({ type: 'jsonb', nullable: true })
    confianzas: Record<string, number> | null;

    @Column({ type: 'varchar', length: 30, nullable: true })
    falla: string | null;

    @Column({ type: 'varchar', length: 60, nullable: true })
    modelo: string | null;

    @Column({ name: 'version_instruccion', type: 'varchar', length: 60, nullable: true })
    versionInstruccion: string | null;

    @Column({ name: 'motivo_modelo', type: 'varchar', length: 300, nullable: true })
    motivoModelo: string | null;

    @Column({ name: 'costo_usd', type: 'numeric', precision: 12, scale: 6, default: 0 })
    costoUsd: string;

    @CreateDateColumn({ type: 'timestamptz' })
    fecha: Date;
}
