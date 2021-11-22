import swaggerJSDoc from 'swagger-jsdoc';
import { ConnectionOptions } from 'typeorm';
import { TClass } from '../routes/RoutesController';
import { ILogger } from './ILogger';

export interface IAppConfig {
    port: number;
    controllers: TClass[];
    logger: ILogger;
    middlewares?: { forEach: (arg0: (middleware: any) => void) => void };
    assets?: string[];
    swaggerOptions?: swaggerJSDoc.OAS3Options;
    dbConfig?: ConnectionOptions;
}
