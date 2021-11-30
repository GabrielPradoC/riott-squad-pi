// Libraries
import { RequestHandler } from 'express';
import { Schema, Meta } from 'express-validator';

// Repositories
import { ChildRepository } from '../../../../library/database/repository/ChildRepository';
import { UserRepository } from '../../../../library/database/repository/UserRepository';

// Validators
import { BaseValidator } from '../../../../library/BaseValidator';

// Utils
import { StringUtils } from '../../../../utils';

// Entities
import { Child, User } from '../../../../library/database/entity';

// Constants
import { DateConstants } from '../../../../models/EnumConstants';

/**
 * ChildValidator
 *
 * Classe de validadores para o endpoint de membros
 */
export class ChildValidator extends BaseValidator {
    /**
     * model
     *
     * Schema para validação no controller de usuários
     */
    private static model: Schema = {
        name: BaseValidator.validators.name,
        id: {
            ...BaseValidator.validators.id(new ChildRepository()),
            errorMessage: 'Membro não encontrado'
        },
        allowance: { in: 'body', isFloat: { options: { min: 0 } }, errorMessage: 'Valor da mesada invalido' },
        // TODO fazer um validator para padronizar o formato de data.
        birthday: { in: 'body', isDate: true, errorMessage: 'Aniversário Invalido' },
        photo: {
            in: 'body',
            custom: {
                options: async (_value: string, { req }: Meta) => {
                    let check = false;

                    if (req.files && req.files[0]) {
                        check = true;
                        req.body.photoRef = req.files[0].buffer;
                    }

                    return check ? Promise.resolve() : Promise.reject();
                }
            },
            errorMessage: 'Foto inválida'
        },
        parent: {
            in: 'body',
            isInt: true,
            custom: {
                options: async (value: string, { req }: Meta) => {
                    const repository: UserRepository = new UserRepository();
                    const parent: User | undefined = await repository.findOne(value);

                    // Usa o nome do repositório para criar o nome de referência. Ex: UserRepository => userRef
                    const refName: string = StringUtils.firstLowerCase(repository.constructor.name.replace('Repository', ''));

                    req.body[`${refName}Ref`] = parent;

                    return parent ? Promise.resolve() : Promise.reject();
                }
            },
            errorMessage: 'Id do responsavel invalido'
        },
        minor: {
            errorMessage: 'O membro deve ter menos de 18 anos',
            custom: {
                options: async (_: string, { req }) => {
                    let check = false;

                    const currentDate: number = Date.now();
                    const birthday: number = new Date(req.body.birthday).getTime();
                    const age: number = currentDate - birthday;

                    check = age < DateConstants.EIGHTEEN_YEARS_IN_MILISECONDS;
                    return check ? Promise.resolve() : Promise.reject();
                }
            }
        },
        duplicate: {
            errorMessage: 'Membro já existe',
            custom: {
                options: async (_: string, { req }) => {
                    let check = false;

                    if (req.body.name) {
                        const childRepository: ChildRepository = new ChildRepository();
                        const child: Child | undefined = await childRepository.findByName(req.body.name);

                        check = child ? req.body.id === child.id.toString() : true;
                    }

                    return check ? Promise.resolve() : Promise.reject();
                }
            }
        }
    };

    /**
     * post
     *
     * @returns Lista de validadores
     */
    public static post(): RequestHandler[] {
        return ChildValidator.validationList({
            name: ChildValidator.model.name,
            birthday: ChildValidator.model.birthday,
            minor: ChildValidator.model.minor,
            allowance: ChildValidator.model.allowance,
            parent: ChildValidator.model.parent,
            duplicate: ChildValidator.model.duplicate,
            photo: ChildValidator.model.photo
        });
    }

    /**
     * put
     *
     * @summary retorna basicamente todos os validadores de model, menos o duplicate.
     *
     * @returns Lista de validadores
     */
    public static put(): RequestHandler[] {
        return ChildValidator.validationList({
            id: ChildValidator.model.id,
            ...ChildValidator.model
        });
    }

    /**
     * onlyId
     *
     * @returns Lista de validadores
     */
    public static onlyId(): RequestHandler[] {
        return BaseValidator.validationList({
            id: ChildValidator.model.id
        });
    }
}
