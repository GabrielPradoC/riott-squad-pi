// Modules
import { DeepPartial, DeleteResult, Repository } from 'typeorm';

// Entities
import { ChildTask } from '../entity';

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
        this.entity = ChildTask;
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
    public insert(task: DeepPartial<ChildTask>): Promise<ChildTask> {
        const childTaskRepository: Repository<ChildTask> = this.getConnection().getRepository(ChildTask);
        return childTaskRepository.save(childTaskRepository.create(task));
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
    public update(task: ChildTask): Promise<ChildTask> {
        return this.getConnection().getRepository(ChildTask).save(task);
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
        return this.getConnection().getRepository(ChildTask).delete(id);
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
    public findById(id: number): Promise<ChildTask | undefined> {
        return this.getConnection().getRepository(ChildTask).findOne({ id });
    }
}
