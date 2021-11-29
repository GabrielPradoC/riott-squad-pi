import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, BaseEntity, ManyToOne } from 'typeorm';
import { Task } from './Task';
import { ChildTaskList } from './ChildTaskList';

@Entity()
export class ChildTask extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @ManyToOne(() => Task, task => task.ChildTask, {
        eager: true
    })
    public task: Task;

    @Column()
    public value: number;

    @ManyToOne(() => ChildTaskList, childTaskList => childTaskList.ChildTask)
    public ChildTaskList: ChildTaskList;

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
