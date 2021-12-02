// Modules
import { DeepPartial, DeleteResult, Repository } from 'typeorm';

// Entities
import { Task } from '../entity';

// Repositories
import { BaseRepository } from './BaseRepository';

/**
 * TaskRepository
 *
 * Repositório para tabela de tasks
 */
export class TaskRepository extends BaseRepository {
    constructor() {
        super();
        this.entity = Task;
    }

    /**
     * insert
     *
     * Adiciona uma nova task
     *
     * @param task - Dados da task
     *
     * @returns Task adicionada
     */
    public insert(task: DeepPartial<Task>): Promise<Task> {
        const taskRepository: Repository<Task> = this.getConnection().getRepository(Task);
        return taskRepository.save(taskRepository.create(task));
    }

    /**
     * insert
     *
     * Altera uma task
     *
     * @param task - Dados da task
     *
     * @returns Task alterada
     */
    public update(task: Task): Promise<Task> {
        return this.getConnection().getRepository(Task).save(task);
    }

    /**
     * delete
     *
     * Remove uma task pelo ID
     *
     * @param id - ID da task
     *
     * @returns Resultado da remoção
     */
    public delete(id: string): Promise<DeleteResult> {
        return this.getConnection().getRepository(Task).delete(id);
    }

    /**
     * findById
     *
     * Busca uma task pelo Id
     *
     * @param id - Id da task
     *
     * @returns Task buscada
     */
    public findById(id: number): Promise<Task | undefined> {
        return this.getConnection().getRepository(Task).findOne({ id });
    }

    /**
     * findByParentId
     *
     * Busca um grupo de tasks pelo id do parente ligado a elas
     *
     * @param parent - Id do parente
     *
     * @returns Array com as tasks
     */
    public findByParentId(parent: number): Promise<Array<Task> | undefined> {
        return this.getConnection().getRepository(Task).find({ where: { parent } });
    }

    /**
     * findByName
     *
     * Busca uma criança pelo nome
     *
     * @param name - Nome da tarefa
     *
     * @returns tarefa buscada
     */
    public findByName(name: string): Promise<Task | undefined> {
        return this.getConnection().getRepository(Task).findOne({ name });
    }
}
