import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, BaseEntity, ManyToOne } from 'typeorm';
import { Task } from './Task';
import { TaskList } from './TaskList';

/**
 * ChildTask.
 *
 * @summary essa classe representa uma tarefa que pertence a uma TaskList.
 *
 * @remarks essa entidade tem uma referência a uma Task original e pertence a uma TaskList
 * @remarks as instancias dessa classe não devem ser criadas diretamente. as rotas de TaskLIst devem gerenciar as instancias dessa classe.
 *
 * @extends {BaseEntity}
 */
@Entity()
export class ChildTask extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @ManyToOne(() => Task, task => task.childTask, {
        eager: true
    })
    public content: Task;

    @Column('decimal', { default: 0.0, precision: 10, scale: 2 })
    public value: number;

    @ManyToOne(() => TaskList, childTaskList => childTaskList.tasks, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    public childTaskList: TaskList;

    @Column({ default: false })
    public isMissed: boolean;

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
