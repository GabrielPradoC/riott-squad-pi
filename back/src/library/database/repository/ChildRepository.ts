// Modules
import { DeepPartial, DeleteResult, Repository } from 'typeorm';

// Entities
import { Child } from '../entity';

// Repositories
import { BaseRepository } from './BaseRepository';

/**
 * Child repository.
 *
 * Repositório para tabela de usuários
 */
export class ChildRepository extends BaseRepository {
    constructor() {
        super();
        this.entity = Child;
    }

    /**
     * insert
     *
     * Adiciona uma nova criança
     *
     * @param child - Dados da criança
     *
     * @returns criança adicionada
     */
    public insert(child: DeepPartial<Child>): Promise<Child> {
        const childRepository: Repository<Child> = this.getConnection().getRepository(Child);
        return childRepository.save(childRepository.create(child));
    }

    /**
     * update
     *
     * Altera uma criança
     *
     * @param child - criança a ser alterada
     *
     * @returns membro alterado
     */
    public update(child: Child): Promise<Child> {
        return this.getConnection().getRepository(Child).save(child);
    }

    /**
     * delete
     *
     * Remove uma criança por id
     *
     * @param id - ID da criança
     *
     * @returns Resultado da remoção
     */
    public delete(id: string): Promise<DeleteResult> {
        return this.getConnection().getRepository(Child).delete(id);
    }

    /**
     * findByName
     *
     * Busca uma criança pelo nome
     *
     * @param name - Nome da criança
     *
     * @returns criança buscada
     */
    public findByName(name: string): Promise<Child | undefined> {
        return this.getConnection().getRepository(Child).findOne({ name });
    }
}
