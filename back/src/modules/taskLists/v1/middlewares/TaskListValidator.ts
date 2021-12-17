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
import { Child, Task, TaskList } from '../../../../library/database/entity';

// Utils
import { StringUtils } from '../../../../utils';

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
     * Schema para validação no controller de taskLists
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
        member: {
            in: 'body',
            isInt: true,
            custom: {
                options: async (value: string, { req }: Meta) => {
                    const repository: ChildRepository = new ChildRepository();
                    const child: Child | undefined = await repository.findOne(value);

                    const refName: string = StringUtils.firstLowerCase(repository.constructor.name.replace('Repository', ''));
                    req.body[`${refName}Ref`] = child;

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
        },
        onlyOneOnHold: {
            custom: {
                options: async (_value: string, { req }: Meta) => {
                    const { childRef } = req.body;

                    const unfinishedLists = childRef.taskLists.filter((taskList: TaskList) => taskList.state !== EnumTaskListState.FINISHED);
                    return unfinishedLists.length === 0
                        ? Promise.resolve()
                        : Promise.reject(Error('Esse membro já possui uma lista em espera ou em atividade'));
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
        return TaskListValidator.validationList({
            name: TaskListValidator.model.name,
            member: TaskListValidator.model.member,
            tasks: TaskListValidator.model.tasks,
            onlyOneOnHold: TaskListValidator.model.onlyOneOnHold,
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
            NotFinished: {
                custom: {
                    options: (_value: string, { req }: Meta) => {
                        const { state } = req.body.taskListRef;

                        if (state === EnumTaskListState.FINISHED) {
                            return Promise.reject(Error('Lista já finalizada'));
                        }
                        return Promise.resolve();
                    }
                },
                errorMessage: 'A lista não pode ser alterada depois de finalizada'
            },
            notStarted: {
                custom: {
                    options: async (_value: string, { req }: Meta) => {
                        const { name, tasks, member, state } = req.body;
                        const currentState: EnumTaskListState = req.body.taskListRef.state;

                        // se o status da lista for Started, a unica mudança valida é mudar o status para Finished
                        if (currentState === EnumTaskListState.STARTED) {
                            if (name || tasks || member) {
                                return Promise.reject(Error('A lista não pode ser alterada depois de iniciada'));
                            }
                            if (state === EnumTaskListState.ONHOLD) {
                                return Promise.reject(Error('A lista não pode voltar ao estado de espera depois de iniciada'));
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
