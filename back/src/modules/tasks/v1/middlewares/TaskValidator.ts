// Libraries
import { RequestHandler } from 'express';
import { Schema, Meta } from 'express-validator';

// Repositories
import { TaskRepository } from '../../../../library/database/repository/TaskRepository';
import { UserRepository } from '../../../../library/database/repository/UserRepository';

// Validators
import { BaseValidator } from '../../../../library/BaseValidator';

// Utils
import { StringUtils } from '../../../../utils';

// Entities
import { Task, User } from '../../../../library/database/entity';

/**
 * TaskValidator
 *
 * Classe de validadores para o endpoint de tarefas
 */
export class TaskValidator extends BaseValidator {
    /**
     * model
     *
     * Schema para validação no controller de tarefas
     */
    private static model: Schema = {
        description: {
            in: 'body',
            isString: true,
            isLength: {
                options: {
                    min: 3
                }
            },
            errorMessage: 'nome invalido'
        },
        id: {
            ...BaseValidator.validators.id(new TaskRepository()),
            errorMessage: 'Tarefa não encontrada'
        },
        parent: {
            in: 'body',
            isInt: true,
            custom: {
                options: async (value: string, { req }: Meta) => {
                    const repository: UserRepository = new UserRepository();
                    const parent: User | undefined = await repository.findOne(value);

                    const refName: string = StringUtils.firstLowerCase(repository.constructor.name.replace('Repository', ''));

                    req.body[`${refName}Ref`] = parent;

                    return parent ? Promise.resolve() : Promise.reject();
                }
            },
            errorMessage: 'Id do responsavel invalido'
        }
    };

    /**
     * post
     *
     * @returns Lista de validadores
     */
    public static post(): RequestHandler[] {
        return TaskValidator.validationList({
            description: TaskValidator.model.description,
            parent: TaskValidator.model.parent
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
        return TaskValidator.validationList({
            id: TaskValidator.model.id,
            ...TaskValidator.model
        });
    }

    /**
     * onlyId
     *
     * @returns Lista de validadores
     */
    public static onlyId(): RequestHandler[] {
        return BaseValidator.validationList({
            id: TaskValidator.model.id
        });
    }
}
