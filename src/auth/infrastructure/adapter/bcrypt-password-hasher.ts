import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PasswordHasher } from '../../domain/port/password-hasher.port';

// Costo 12: unos 250 ms por hash, suficiente para frenar ataques de fuerza bruta sobre la base.
const COST = 12;

@Injectable()
export class BcryptPasswordHasher implements PasswordHasher {
    hash(plain: string): Promise<string> {
        return bcrypt.hash(plain, COST);
    }

    matches(plain: string, hash: string): Promise<boolean> {
        return bcrypt.compare(plain, hash);
    }
}
