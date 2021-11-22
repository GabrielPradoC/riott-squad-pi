import { ConnectionOptions } from 'typeorm';
import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

// Opções genéricas
const baseOptions: Omit<ConnectionOptions, 'type'> = {
    name: 'riott-api', // Nome da conexão
    database: 'riott-database', // Nome do banco
    entities: ['src/library/database/entity/**/*.ts', 'library/database/entity/**/*.js'], // Local das entidades
    migrations: ['migrations/seeds/*.ts'], // Local das migrations
    cli: {
        migrationsDir: 'migrations/seeds'
    },
    migrationsRun: process.env.NODE_ENV === 'development', // Habilita execução das migrations
    logging: process.env.NODE_ENV === 'development', // Habilita logs
    synchronize: true
};

// Opções para conexão com MySql
const mysqlOptions: MysqlConnectionOptions = {
    type: 'mysql',
    url: process.env.MYSQL_CONNECTION_URL,
    logging: false // Habilitar para visualizar as queries do banco
};

// Opções para conexão com MongoDB
const mongoOptions: MongoConnectionOptions = {
    type: 'mongodb',
    url: process.env.MONGO_CONNECTION_URL,
    authSource: 'admin',
    useUnifiedTopology: true,
    useNewUrlParser: true
};

export const dbConfig = {
    ...baseOptions,
    ...mongoOptions
} as ConnectionOptions;
