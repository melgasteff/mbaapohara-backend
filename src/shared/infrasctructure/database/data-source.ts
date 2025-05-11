import { DataSource } from "typeorm"
import { config as loadEnv } from "dotenv"

loadEnv({ path: '.env' })

export default new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    migrations: [__dirname + '/migrations/**/*.{ts,js}'],
    synchronize: false, // Siempre false en prod,
});