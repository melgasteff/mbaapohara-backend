// Crea el primer administrador o promueve una cuenta existente (D5).
//   npm run admin:create -- correo@ejemplo.com
// La contraseña se pide por la terminal sin mostrarla, para que no quede en el historial. Si la entrada no es
// una terminal (por ejemplo, en un despliegue), se lee de la entrada estándar.
import { NestFactory } from '@nestjs/core';
import { Writable } from 'stream';
import * as readline from 'readline';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { AppModule } from 'src/app.module';
import { RegisterDTO } from '../../presentation/dto/auth.dto';
import { CreateAdminUseCase } from '../../application/use-case/create-admin.use-case';

async function askPassword(): Promise<string> {
    if (!process.stdin.isTTY) {
        const chunks: Buffer[] = [];
        for await (const chunk of process.stdin) chunks.push(chunk as Buffer);
        return Buffer.concat(chunks).toString('utf8').split(/\r?\n/)[0];
    }
    let muted = false;
    const output = new Writable({ write: (chunk, _enc, done) => { if (!muted) process.stdout.write(chunk); done(); } });
    const rl = readline.createInterface({ input: process.stdin, output, terminal: true });
    const question = (text: string) => new Promise<string>(resolve => {
        process.stdout.write(text); muted = true;
        rl.question('', answer => { muted = false; process.stdout.write('\n'); resolve(answer); });
    });
    const first = await question('Contraseña: ');
    const second = await question('Repetir contraseña: ');
    rl.close();
    if (first !== second) throw new Error('Las contraseñas no coinciden');
    return first;
}

async function main() {
    const email = (process.argv[2] ?? '').trim().toLowerCase();
    const password = await askPassword();

    // Las mismas reglas que el registro (email válido y contraseña fuerte)
    const errors = validateSync(plainToInstance(RegisterDTO, { email, password, aceptaTerminos: true }));
    if (errors.length) {
        throw new Error(errors.flatMap(e => Object.values(e.constraints ?? {})).join('\n'));
    }

    const app = await NestFactory.createApplicationContext(AppModule, { logger: ['error'] });
    try {
        const result = await app.get(CreateAdminUseCase).execute(email, password);
        console.log(`Cuenta de administrador ${result}: ${email}`);
    } finally {
        await app.close();
    }
}

main().catch(error => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
});
