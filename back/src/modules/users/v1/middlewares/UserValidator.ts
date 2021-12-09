// Libraries
import { RequestHandler } from 'express';
import { Schema, Meta } from 'express-validator';

// Repositories
import { UserRepository } from '../../../../library/database/repository/UserRepository';

// Utils
import { StringUtils } from '../../../../utils';

// Validators
import { BaseValidator } from '../../../../library/BaseValidator';

// Entities
import { User } from '../../../../library/database/entity';

/**
 * UserValidator
 *
 * Classe de validadores para o endpoint de usuários
 */
export class UserValidator extends BaseValidator {
    /**
     * model
     *
     * Schema para validação no controller de usuários
     */
    private static model: Schema = {
        name: BaseValidator.validators.name,
        email: { in: 'body', isString: true, isEmail: true },
        id: {
            ...BaseValidator.validators.id(new UserRepository()),
            errorMessage: 'Usuário não encontrado'
        },
        duplicate: {
            errorMessage: 'Usuário já existe',
            custom: {
                options: async (_: string, { req }) => {
                    let check = false;

                    if (req.body.name) {
                        const userRepository: UserRepository = new UserRepository();
                        const user: User | undefined = await userRepository.findByName(req.body.name);

                        check = user ? req.body.id === user.id.toString() : true;
                    }
                    if (req.body.email) {
                        const userRepository: UserRepository = new UserRepository();
                        const user: User | undefined = await userRepository.findByEmail(req.body.email);

                        check = user ? req.body.id === user.id.toString() : true;
                    }

                    return check ? Promise.resolve() : Promise.reject();
                }
            }
        }
    };

    private static logInModel: Schema = {
        email: {
            in: 'body',
            isString: true,
            isEmail: true,
            errorMessage: 'Email inválido',
            custom: {
                options: async (value: string, { req }: Meta) => {
                    const userRepository: UserRepository = new UserRepository();
                    const data = await userRepository.findByEmail(value);

                    // Usa o nome do repositório para criar o nome de referência. Ex: UserRepository => userRef
                    const refName: string = StringUtils.firstLowerCase(userRepository.constructor.name.replace('Repository', ''));

                    req.body[`${refName}Ref`] = data;

                    return Promise.resolve();
                }
            }
        },
        password: {
            in: 'body',
            isString: true,
            errorMessage: 'Senha inválida'
        }
    };

    /**
     * post
     *
     * @returns Lista de validadores
     */
    public static post(): RequestHandler[] {
        return UserValidator.validationList({
            name: UserValidator.model.name,
            email: UserValidator.model.email,
            password: {
                in: 'body',
                isString: true,
                isLength: {
                    options: {
                        min: 3
                    }
                }
            },
            duplicate: UserValidator.model.duplicate
        });
    }

    /**
     * put
     *
     * @returns Lista de validadores
     */
    public static put(): RequestHandler[] {
        return UserValidator.validationList({
            id: UserValidator.model.id,
            ...UserValidator.model
        });
    }

    /**
     * onlyId
     *
     * @returns Lista de validadores
     */
    public static onlyId(): RequestHandler[] {
        return BaseValidator.validationList({
            id: UserValidator.model.id
        });
    }

    public static login(): RequestHandler[] {
        return BaseValidator.validationList(UserValidator.logInModel);
    }
}
