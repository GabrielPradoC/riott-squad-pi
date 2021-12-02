// Libraries
import { RequestHandler } from 'express';
import { Schema, Meta } from 'express-validator';

// Repositories
import { TaskListRepository } from '../../../../library/database/repository/TaskListRepository';
import { ChildRepository } from '../../../../library/database/repository/ChildRepository';
import { TaskRepository } from '../../../../library/database/repository/TaskRepository';

// Validators
import { BaseValidator } from '../../../../library/BaseValidator';

// Entities
import { Child, Task } from '../../../../library/database/entity';

// Enums
import { EnumTaskListState } from '../../../../models/EnumTaskListState';

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
        dateStart: { in: 'body', isDate: { options: { format: 'DD/MM/YYYY' } }, errorMessage: 'Data de inicio invalida' },
        dateEnd: { in: 'body', isDate: { options: { format: 'DD/MM/YYYY' } }, errorMessage: 'Data de fim invalida' },
        member: {
            in: 'body',
            isInt: true,
            custom: {
                options: async (value: string) => {
                    const repository: ChildRepository = new ChildRepository();
                    const child: Child | undefined = await repository.findOne(value);

                    return child ? Promise.resolve() : Promise.reject();
                }
            },
            errorMessage: 'Id do membro invalido'
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
            member: TaskListValidator.model.member,
            tasks: TaskListValidator.model.tasks,
            'tasks.*.task': TaskListValidator.model['tasks.*.task'],
            'tasks.*.value': TaskListValidator.model['tasks.*.value']
        });
    }

    /**
     * patch
     *
     * @summary retorna basicamente todos os validadores de model, menos o duplicate.
     *
     * @returns Lista de validadores
     */
    public static patch(): RequestHandler[] {
        return TaskListValidator.validationList({
            id: TaskListValidator.model.id,
            state: {
                in: 'body',
                isString: true,
                optional: true,
                custom: {
                    options: (value: string) => {
                        if (value in EnumTaskListState) {
                            return Promise.resolve();
                        }
                        return Promise.reject();
                    }
                },
                errorMessage: 'Estado invalido (deve ser um de: STARTED | FINISHED | ONHOLD)'
            },
            name: {
                in: 'body',
                isString: true,
                isLength: {
                    options: {
                        min: 3
                    }
                },
                optional: true,
                errorMessage: 'Nome invalido'
            },
            dateStart: TaskListValidator.model.dateStart,
            dateEnd: TaskListValidator.model.dateEnd,
            notStarted: {
                custom: {
                    options: async (_value: string, { req }: Meta) => {
                        const { state } = req.body.taskListRef;

                        if (state !== EnumTaskListState.ONHOLD) {
                            // Se o estado não for onhold a uníca mudança valida é modificar o estado.
                            if (req.body.name || req.body.tasks || req.body.dateStart || req.body.dateEnd) {
                                return Promise.reject();
                            }
                        }
                        return Promise.resolve();
                    }
                },
                errorMessage: 'A lista só pode ser modificada quando seu estado é ONHOLD'
            },
            tasks: { ...TaskListValidator.model.tasks, optional: true },
            'tasks.*.task': TaskListValidator.model['tasks.*.task'],
            'tasks.*.value': TaskListValidator.model['tasks.*.value']
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
