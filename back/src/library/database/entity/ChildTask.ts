import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, BaseEntity, ManyToOne } from 'typeorm';
import { Task } from './Task';
import { TaskList } from './TaskList';

@Entity()
export class ChildTask extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @ManyToOne(() => Task, task => task.childTask, {
        eager: true
    })
    public task: Task;

    @Column()
    public value: number;

    @ManyToOne(() => TaskList, childTaskList => childTaskList.tasks)
    public childTaskList: TaskList;

    @Column()
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
