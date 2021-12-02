// Libraries
import { RequestHandler } from 'express';
import { Schema } from 'express-validator';

// Repositories
import { TaskListRepository } from '../../../../library/database/repository/TaskListRepository';
import { ChildRepository } from '../../../../library/database/repository/ChildRepository';
import { TaskRepository } from '../../../../library/database/repository/TaskRepository';

// Validators
import { BaseValidator } from '../../../../library/BaseValidator';

// Entities
import { Child, Task } from '../../../../library/database/entity';

/**
 * TaskListValidator
 *
 * Classe de validadores para o endpoint de taskLists
 */
export class TaskListValidator extends BaseValidator {
    /**
     * model
     *
     * Schema para validação no controller de usuários
     */
    private static model: Schema = {
        name: {
            in: 'body',
            isString: true,
            isLength: {
                options: {
                    min: 3
                }
            },
            errorMessage: 'Nome invalido'
        },
        id: {
            ...BaseValidator.validators.id(new TaskListRepository()),
            errorMessage: 'Lista não encontrada'
        },
        dateStart: { in: 'body', isDate: true, errorMessage: 'Aniversário Invalido' },
        dateEnd: { in: 'body', isDate: true, errorMessage: 'Aniversário Invalido' },
        child: {
            in: 'body',
            isInt: true,
            custom: {
                options: async (value: string) => {
                    const repository: ChildRepository = new ChildRepository();
                    const child: Child | undefined = await repository.findOne(value);

                    return child ? Promise.resolve() : Promise.reject();
                }
            },
            errorMessage: 'Id do responsavel invalido'
        },
        tasks: {
            in: 'body',
            isArray: true
        },
        'tasks.*.task': {
            isInt: true,
            custom: {
                options: async (value: string) => {
                    const repository: TaskRepository = new TaskRepository();
                    const task: Task | undefined = await repository.findOne(value);

                    return task ? Promise.resolve() : Promise.reject();
                }
            },
            errorMessage: 'Id da tarefa invalida'
        },
        'tasks.*.value': {
            isFloat: { options: { min: 1 } },
            errorMessage: 'Valor da tarefa invalido'
        }
    };

    /**
     * post
     *
     * @returns Lista de validadores
     */
    public static post(): RequestHandler[] {
        return TaskListValidator.validationList({
            name: TaskListValidator.model.name,
            dateStart: TaskListValidator.model.dateStart,
            dateEnd: TaskListValidator.model.dateEnd,
            child: TaskListValidator.model.child,
            tasks: TaskListValidator.model.tasks,
            'tasks.*.task': TaskListValidator.model['tasks.*.task'],
            'tasks.*.value': TaskListValidator.model['tasks.*.value']
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
        return TaskListValidator.validationList({
            id: TaskListValidator.model.id,
            ...TaskListValidator.model
        });
    }

    /**
     * onlyId
     *
     * @returns Lista de validadores
     */
    public static onlyId(): RequestHandler[] {
        return BaseValidator.validationList({
            id: TaskListValidator.model.id
        });
    }
}
