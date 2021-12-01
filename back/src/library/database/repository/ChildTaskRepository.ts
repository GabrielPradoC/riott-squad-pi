// Modules
import { DeepPartial, DeleteResult, Repository } from 'typeorm';

// Entities
import { ChildTask } from '../entity';

// Repositories
import { BaseRepository } from './BaseRepository';

/**
 * ChildTaskRepository
 *
 * Repositório para tabela de childTasks
 */
export class ChildTaskRepository extends BaseRepository {
    constructor() {
        super();
        this.entity = ChildTask;
    }

    /**
     * insert
     *
     * Adiciona uma nova task
     *
     * @param childTask - Dados da task
     *
     * @returns Task adicionada
     */
    public insert(childTask: DeepPartial<ChildTask>): Promise<ChildTask> {
        const taskRepository: Repository<ChildTask> = this.getConnection().getRepository(ChildTask);
        return taskRepository.save(taskRepository.create(childTask));
    }

    /**
     * insert
     *
     * Altera uma task
     *
     * @param childTask - Dados da task
     *
     * @returns Task alterada
     */
    public update(childTask: ChildTask): Promise<ChildTask> {
        return this.getConnection().getRepository(ChildTask).save(childTask);
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
