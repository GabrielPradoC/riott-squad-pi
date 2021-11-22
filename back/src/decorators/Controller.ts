// Modules
import 'reflect-metadata';

// Models
import { EnumDecorators } from '../models';

export const Controller = (prefix = ''): ClassDecorator => {
    return (target: any) => {
        Reflect.defineMetadata(EnumDecorators.CONTROLLER_PREFIX, prefix, target);

        if (!Reflect.hasMetadata(EnumDecorators.ROUTES, target)) {
            Reflect.defineMetadata(EnumDecorators.ROUTES, [], target);
        }
    };
};
