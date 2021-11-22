import { EnumMethod } from './EnumMethod';

export interface IRouteDef {
    path: string;
    requestMethod: EnumMethod;
    methodName: string | symbol;
}
