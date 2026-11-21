import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Page, PageRequest, pageOffset } from 'src/shared/domain/page';
import { AccountStatus, UserRole } from 'src/shared/domain/user-role';
import { isUniqueViolation } from 'src/shared/infrastructure/database/pg-errors';
import { User } from './user.entity';

export interface NewUser {
    email: string;
    passwordHash: string;
    rol: UserRole;
    fechaConsentimiento: Date | null;
}

export interface UserFilters {
    q?: string;
    rol?: UserRole;
    estado?: AccountStatus;
}

export class EmailTakenError extends Error {
    constructor(email: string) {
        super(`Ya existe una cuenta con el email ${email}`);
    }
}

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly repo: Repository<User>,
        private readonly dataSource: DataSource,
    ) { }

    static normalizeEmail(email: string): string {
        return email.trim().toLowerCase();
    }

    findById(id: number): Promise<User | null> {
        return this.repo.findOneBy({ id });
    }

    // Incluye el hash de la contraseña: solo para verificar credenciales (auth).
    findWithPasswordByEmail(email: string): Promise<User | null> {
        return this.repo.createQueryBuilder('usuario')
            .addSelect('usuario.passwordHash')
            .where('lower(usuario.email) = :email', { email: UsersService.normalizeEmail(email) })
            .getOne();
    }

    findWithPasswordById(id: number): Promise<User | null> {
        return this.repo.createQueryBuilder('usuario')
            .addSelect('usuario.passwordHash')
            .where('usuario.id = :id', { id })
            .getOne();
    }

    // El duplicado lo detecta el índice UNIQUE sobre lower(email).
    async create(data: NewUser): Promise<User> {
        try {
            const saved = await this.repo.save(this.repo.create({ ...data, email: UsersService.normalizeEmail(data.email) }));
            return this.findById(saved.id);
        } catch (error) {
            if (isUniqueViolation(error)) throw new EmailTakenError(data.email);
            throw error;
        }
    }

    async setPasswordAndRole(id: number, passwordHash: string, rol: UserRole): Promise<void> {
        await this.repo.update(id, { passwordHash, rol, estado: AccountStatus.Active });
    }

    // D9: borra la cuenta; la base borra en cascada sus reseñas, versiones y respuestas.
    async remove(id: number): Promise<void> {
        await this.repo.delete(id);
    }

    // ---------- administración

    async findPage(request: PageRequest, filters: UserFilters): Promise<Page<User>> {
        const qb = this.repo.createQueryBuilder('usuario');
        if (filters.q) qb.andWhere('usuario.email ILIKE :q', { q: `%${filters.q.replace(/[\\%_]/g, c => '\\' + c)}%` });
        if (filters.rol) qb.andWhere('usuario.rol = :rol', { rol: filters.rol });
        if (filters.estado) qb.andWhere('usuario.estado = :estado', { estado: filters.estado });
        const [data, total] = await qb
            .orderBy('usuario.fechaCreacion', 'DESC')
            .skip(pageOffset(request))
            .take(request.pageSize)
            .getManyAndCount();
        return { data, total, page: request.page, pageSize: request.pageSize };
    }

    async findOneOrFail(id: number): Promise<User> {
        const user = await this.findById(id);
        if (!user) throw new NotFoundException(`No existe el usuario ${id}`);
        return user;
    }

    // El administrador no puede bloquearse ni quitarse el rol a sí mismo, para no quedar sin acceso.
    async setStatus(actorId: number, id: number, estado: AccountStatus): Promise<User> {
        if (actorId === id && estado === AccountStatus.Blocked) throw new BadRequestException('No puedes bloquear tu propia cuenta');
        await this.findOneOrFail(id);
        await this.repo.update(id, { estado });
        return this.findOneOrFail(id);
    }

    async setRole(actorId: number, id: number, rol: UserRole): Promise<User> {
        if (actorId === id && rol !== UserRole.Admin) throw new BadRequestException('No puedes quitarte el rol de administrador');
        await this.findOneOrFail(id);
        await this.repo.update(id, { rol });
        return this.findOneOrFail(id);
    }

    // ---------- exportación de datos (derecho de acceso)

    // Exporta la cuenta y todas sus reseñas, con cada versión enviada (también las rechazadas: son datos de la persona)
    // y sus respuestas. Lee las tablas de reseñas directamente: es provisorio hasta que el módulo reviews (3.3) exponga
    // su propia exportación.
    async exportData(id: number): Promise<{ cuenta: User; resenas: unknown[] }> {
        const cuenta = await this.findOneOrFail(id);
        const resenas = await this.dataSource.query(
            `SELECT r.id, emp.nombre AS empresa, s.nombre AS local, r.eliminada, r.fecha_creacion AS "fechaCreacion",
                    (r.id_version_publicada IS NOT NULL) AS publicada,
                    COALESCE((
                        SELECT json_agg(json_build_object(
                            'numero', v.numero, 'estado', v.estado, 'cargo', c.descripcion, 'situacion', v.situacion,
                            'ultimoAnio', v.ultimo_anio, 'tipoContrato', tc.nombre, 'modalidad', m.nombre,
                            'calificacion', v.calificacion, 'loBueno', v.lo_bueno, 'aMejorar', v.a_mejorar,
                            'motivoModeracion', v.motivo_moderacion, 'fecha', v.fecha_creacion,
                            'respuestas', COALESCE((
                                SELECT json_agg(json_build_object('criterio', i.descripcion, 'respuesta', rc.respuesta) ORDER BY i.orden)
                                FROM respuestas_criterio rc JOIN items i ON i.id = rc.id_item
                                WHERE rc.id_version = v.id), '[]')
                        ) ORDER BY v.numero)
                        FROM versiones_resena v
                        JOIN cargos c ON c.id = v.id_cargo
                        JOIN tipo_contrato tc ON tc.id = v.id_tipo_contrato
                        JOIN modalidades m ON m.id = v.id_modalidad
                        WHERE v.id_resena = r.id), '[]') AS versiones
             FROM resenas r
             JOIN sucursales s ON s.id = r.id_sucursal
             JOIN empresas emp ON emp.id = s.id_empresa
             WHERE r.id_usuario = $1
             ORDER BY r.id`,
            [id],
        );
        return { cuenta, resenas };
    }
}
