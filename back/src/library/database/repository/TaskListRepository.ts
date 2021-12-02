// Modules
import { DeepPartial, DeleteResult, Repository } from 'typeorm';

// Entities
import { TaskList } from '../entity';

// Repositories
import { BaseRepository } from './BaseRepository';

/**
 * TaskListRepository
 *
 * Repositório para tabela de atividades(taskList)
 */
export class TaskListRepository extends BaseRepository {
    constructor() {
        super();
        this.entity = TaskList;
    }

    public save(taskList: TaskList): Promise<TaskList> {
        return this.getConnection().getRepository(TaskList).save(taskList);
    }

    /**
     * insert
     *
     * Adiciona uma nova lista de ativdades
     *
     * @param taskList - Dados da lista de atividades
     *
     * @returns Usuário adicionado
     */
    public insert(taskList: DeepPartial<TaskList>): Promise<TaskList> {
        const taskListRepository: Repository<TaskList> = this.getConnection().getRepository(TaskList);
        return taskListRepository.save(taskListRepository.create(taskList));
    }

    /**
     * insert
     *
     * Altera uma lista de atividades
     *
     * @param taskList - Dados da lista de atividades
     *
     * @returns Usuário alterado
     */
    public update(taskList: TaskList): Promise<TaskList> {
        return this.getConnection().getRepository(TaskList).save(taskList);
    }

    /**
     * delete
     *
     * Remove uma lista de atividade pelo ID
     *
     * @param id - ID da lista de atividades
     *
     * @returns Resultado da remoção
     */
    public delete(id: string): Promise<DeleteResult> {
        return this.getConnection().getRepository(TaskList).delete(id);
    }

    /**
     * findByName
     *
     * Busca uma lista pelo nome.
     *
     * @param name - Nome do usuário
     *
     * @returns lista buscada
     */
    public findByName(name: string): Promise<TaskList | undefined> {
        return this.getConnection().getRepository(TaskList).findOne({ name });
    }
}
