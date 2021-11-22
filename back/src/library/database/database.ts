// Modules
import { Connection, ConnectionOptions, createConnection } from 'typeorm';

// Models
import { EnumConstants } from '../../models';

/**
 * Database
 *
 * Classe para gerenciar a conexão com o banco de dados
 */
export class Database {
    /**
     * connect
     *
     * Retorna conexão com o banco de dados
     *
     * @param connectionOptions - Opções para conexão
     *
     * @returns Instância de conexão
     */
    public static async connect(connectionOptions: ConnectionOptions): Promise<Connection> {
        const customConfig: ConnectionOptions = {
            ...connectionOptions,
            name: EnumConstants.CONNECTION_NAME
        };

        return createConnection(customConfig);
    }
}
