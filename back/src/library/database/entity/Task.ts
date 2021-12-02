import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, BaseEntity, OneToMany, ManyToOne } from 'typeorm';
import { ChildTask } from './ChildTask';
import { User } from './User';

/**
 * Task.
 *
 * @summary Representa uma tarefa criada por um usuário.
 * @remarks essa não é a entidade que faz parte de uma lista de ativades. Uma lista de ativades contém ChildTasks
 *
 * @extends {BaseEntity}
 */
@Entity()
export class Task extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public description: string;

    @ManyToOne(() => User, user => user.createdTasks)
    public parent: User;

    @OneToMany(() => ChildTask, childTask => childTask.content)
    public childTask: ChildTask[];

    @Column()
    public createdAt: Date;

    @Column()
    public updatedAt: Date;

    @BeforeInsert()
    public setCreateDate(): void {
        this.createdAt = new Date();
    }

    @BeforeInsert()
    @BeforeUpdate()
    public setUpdateDate(): void {
        this.updatedAt = new Date();
    }
}
