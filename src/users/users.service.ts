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

    // D9: borra la cuenta; la base borra en cascada sus evaluaciones y detalles.
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

    // Lee las evaluaciones del usuario directamente de sus tablas: es provisorio hasta que reviews (Fase 3)
    // exponga su propia exportación.
    async exportData(id: number): Promise<{ cuenta: User; evaluaciones: unknown[] }> {
        const cuenta = await this.findOneOrFail(id);
        const evaluaciones = await this.dataSource.query(
            `SELECT e.id, emp.nombre AS empresa, s.nombre AS local, c.descripcion AS cargo, e.desde, e.hasta,
                    e.eliminado,
                    COALESCE(json_agg(json_build_object(
                        'item', i.descripcion, 'calificacion', d.calificacion, 'otroMotivo', d.otro_motivo)
                    ) FILTER (WHERE d.id IS NOT NULL), '[]') AS detalles
             FROM evaluaciones e
             LEFT JOIN empresas emp ON emp.id = e.id_empresa
             LEFT JOIN sucursales s ON s.id = e.id_sucursal
             LEFT JOIN cargos c ON c.id = e.id_cargo
             LEFT JOIN detalle_evaluacion d ON d.id_evaluacion = e.id
             LEFT JOIN items i ON i.id = d.id_item
             WHERE e.id_usuario = $1
             GROUP BY e.id, emp.nombre, s.nombre, c.descripcion
             ORDER BY e.id`,
            [id],
        );
        return { cuenta, evaluaciones };
    }
}
