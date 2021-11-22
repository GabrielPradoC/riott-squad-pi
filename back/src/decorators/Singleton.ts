import 'reflect-metadata';

const key = Symbol('singleton decorator');

export const Singleton = <T extends new (...args: any[]) => any>(type: T): any => {
    return new Proxy(type, {
        construct(target: any, argsList, newTarget) {
            if (target.prototype !== newTarget.prototype) {
                return Reflect.construct(target, argsList, newTarget);
            }

            if (!target[key]) {
                // eslint-disable-next-line no-param-reassign
                target[key] = Reflect.construct(target, argsList, newTarget);
            }

            return target[key];
        }
    });
};
