import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, BaseEntity, OneToMany, ManyToOne } from 'typeorm';
import { ChildTask } from './ChildTask';
import { Parent } from './Parent';

@Entity()
export class Task extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public title: string;

    @ManyToOne(() => Parent, parent => parent.createdTasks)
    public parent: Parent;

    @OneToMany(() => ChildTask, childTask => childTask.task)
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
