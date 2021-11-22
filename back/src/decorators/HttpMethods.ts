// Modules
import 'reflect-metadata';

// Models
import { EnumMethod, IRouteDef, EnumDecorators } from '../models';

const routeAdd = (method: EnumMethod, path: string): MethodDecorator => {
    return (target: any, propertyKey: string | symbol): void => {
        if (!Reflect.hasMetadata(EnumDecorators.ROUTES, target.constructor)) {
            Reflect.defineMetadata(EnumDecorators.ROUTES, [], target.constructor);
        }

        const routes = Reflect.getMetadata(EnumDecorators.ROUTES, target.constructor) as IRouteDef[];

        routes.push({
            requestMethod: method,
            path,
            methodName: propertyKey
        });

        Reflect.defineMetadata(EnumDecorators.ROUTES, routes, target.constructor);
    };
};

export const Get = (path = ''): MethodDecorator => routeAdd(EnumMethod.GET, path);
export const Post = (path = ''): MethodDecorator => routeAdd(EnumMethod.POST, path);
export const Put = (path = ''): MethodDecorator => routeAdd(EnumMethod.PUT, path);
export const Patch = (path = ''): MethodDecorator => routeAdd(EnumMethod.PATCH, path);
export const Delete = (path = ''): MethodDecorator => routeAdd(EnumMethod.DELETE, path);
