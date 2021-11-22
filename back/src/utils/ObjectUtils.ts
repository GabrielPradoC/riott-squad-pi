import { TObject } from '../models';

/**
 * ObjectUtils
 *
 * Classe de utils para tratamento de objetos
 */
export class ObjectUtils {
    /**
     * isObject
     *
     * Verifica se o argumento passado tem o tipo primitivo 'object'
     *
     * @param object - Objeto a ser validado
     *
     * @returns É um objeto
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public static isObject(object: any): boolean {
        const type = typeof object;
        return (type === 'function' || type === 'object') && !!object && object.constructor === Object;
    }

    /**
     * clearData
     *
     * Limpa todos os campos sem valor do objeto (primeiro nível)
     *
     * @param data - Objeto a ser manipulado
     *
     * @returns Objeto tratado
     */
    public static clearData(data: TObject): TObject {
        const response: TObject = { ...data };

        Object.keys(response).forEach((key: string) => {
            // Ignora valores 'false' e '0'
            if (!response[key] && response[key] !== 0 && response[key] !== false) {
                delete response[key];
            }
        });

        return response;
    }
}
